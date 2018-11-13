import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { createPromiseDispatch } from 'utils/actionUtil';
import { actions, ACTION_NAMES   } from 'models/department';
import { actions as settingActions } from 'models/setting';
import { isNumeric, checkId } from 'utils/utils';
import { Modal, Button, Input } from 'components/Base/';
import OrgTreeSelect from 'components/OrgTreeSelect';
import configableFieldStrategy, { getFieldError } from 'components/Biz/ConfigableField/ConfigableField';
import FormBox from 'components/FormBox';
import { Layout, SplitRow } from 'layouts/FormLayout';

const {
  GET_COMPANY_TREE,
  GET_DEPARTMENT,
  SAVE_DEPARTMENT,

  UPDATE_DEPARTMENT_INFO,
  UPDATE_ERROR,
} = actions;

function coverFormData2API(data, formField) {
  const apiData = {};
  Object.keys(data).forEach(code => {
    const val = data[code];
    if (formField.filter(field => field.id && field.code === code).length > 0) {
      apiData.customField = apiData.customField || {};
      apiData.customField[code] = val;
    } else {
      apiData[code] = val;
    }
  });
  return apiData;
}

function formatTree(company, disabledCB) {
  return company && {
    ...company,
    disabled: company.disabled || !!disabledCB(company),
    children: company.children.map(child => formatTree(child, disabledCB)),
  };
}

@connect(({ department, error, loading }) => ({
  loadingGetDepartment: loading.effects['department/GET_DEPARTMENT'],
  departmentInfo: department.departmentInfo,
  companyTree: formatTree(department.companyTree, ({value} = {}) => value && ~value.split('-').indexOf(`${(department.departmentInfo || {}).id}`) ),
  formField: department.formField,
  error: error.department,
}))
export default class EditModal extends PureComponent {
  constructor(props) {
    super(props);

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.getProp = name => {
      const { [name]: prop } = this.props;
      return prop;
    };

    this.updateDepartmentInfo = payload => this.dispatch(UPDATE_DEPARTMENT_INFO, payload);

    this.createFieldElement = configableFieldStrategy(
      {
        parentId: value => {
          return (
            <OrgTreeSelect
              showSearch
              treeDefaultExpandAll
              placeholder="请选择"
              value={value}
              treeData={[this.getProp('companyTree')]}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              onChange={v => v && this.onChange('parentId', v)}
            />
          );
        },
        code: (value, { placeholder }) => (
          <Input
            disabled={this.getProp('data').id}
            placeholder={placeholder}
            value={value}
            onChange={e => this.onChange('code', e.target.value)}
          />
        ),
      },
      this.onChange
    );
  }

  componentDidMount() {
    this.handleVisibleChange({});
  }

  componentDidUpdate(prevProps) {
    this.handleVisibleChange(prevProps);
  }

  onChange = (code, value) => {
    const { departmentInfo, formField } = this.props;
    this.updateDepartmentInfo({
      ...departmentInfo,
      [code]: value,
    });
    let error = getFieldError( value, formField.find(config => config.code === code) );
    if( !error ) {
      if( code === 'code' ) {
        if( !checkId(value) ) {
          error = '请输入小于8位的字母或数字';
        }
      }
      if( code === 'formation' ) {
        if( !isNumeric(value) ) {
          error = '请输入数字';
        }
      }
    }

    this.updateFormError({
      [code]: error,
    });
  };

  promiseDispatch = createPromiseDispatch();

  handleVisibleChange = prevProps => {
    const { formField, departmentInfo, data, loadingGetDepartment } = this.props;
    const prevVisable = !!prevProps.data;
    const visable = !!data;
    if (prevVisable !== visable) {
      if (visable) {
        this.dispatch(GET_COMPANY_TREE);
        this.dispatch(settingActions.GET_ORG_CUS_FIELD_LIST);
        if (data.id) {
          this.dispatch(GET_DEPARTMENT, data.id);
        } else {
          this.updateDepartmentInfo(data);
        }
      } else {
        this.updateDepartmentInfo();
      }
    }

    if( data ){
      if (!prevProps.data || prevProps.data.id !== data.id || ((prevProps.loadingGetDepartment && !loadingGetDepartment))){
        const formError = {};
      const customField = (departmentInfo && departmentInfo.customField) ? departmentInfo.customField : undefined;
      const obj  = Object.assign({},departmentInfo, customField);
      delete obj.customField;
      if( obj ) {
        formField.forEach(({ required, code }) => {
          if( code === 'parentId' ) {
            formError[code] = required && !(obj.parentCompanyId || obj.parentDepartmentId || obj.parentId);
          } else {
            formError[code] = required && !obj[code];
          }
        });
        this.updateFormError(formError);
      }
      }
    };
  }

  updateFormError = formError => {
    const { error } = this.props;
    this.dispatch(UPDATE_ERROR, {
      error,
      formError,
    });

  };

  editError = (errorMessage,) => {
    message.error(errorMessage);
  };

  clearError = () => {
    this.dispatch(UPDATE_ERROR, {
      [ACTION_NAMES.SAVE_DEPARTMENT]: undefined,
    });
  };

  handleOk = () => {
    const { departmentInfo, handleOk, formField } = this.props;
    delete departmentInfo.parentDepartmentName;
    delete departmentInfo.parentCompanyName;
    const info = Object.assign({}, departmentInfo)
    const { parentId } = info;
    const parentInfo = parentId.split('-');
    const id = parentInfo[1];
    info.parentId = id
    info.enable = 1;
    this.promiseDispatch(SAVE_DEPARTMENT, coverFormData2API(info, formField))
    .then(res => {
      handleOk(res);
    })
    .catch(e => {
      if( e && e.meta ) {
        const { code } = e.meta;
        switch(code) {
          case "12402":
            this.updateFormError({
              code: e.meta.message,
            });
            break;
          case '12203':
            this.updateFormError({
              parentId: e.meta.message,
            })
            break;
          default:
        }
      }
    });
  };

  render() {
    const {
      handleCancel,
      formField,
      departmentInfo,
      data,
      error,
      active,
      onDelete,
      onInvalid,
      companyTree,
    } = this.props;
    const visible = !!data;
    const isEdit = visible && !!data.id;
    const rows = [];
    let columns = [];
    const hasError = error && error[ACTION_NAMES.SAVE_DEPARTMENT];
    const formError = error && error.form;
    if(hasError){
      this.editError(hasError.message);
      this.clearError();
    }
    if (data && formField && companyTree) {
      formField.forEach((config, index) => {
        const key = index;
        // if (!isEdit || departmentInfo.parentId || config.code !== 'parentId') {
        columns.push(
          <FormBox
            key={key}
            errorMsg={formError && formError[config.code]}
            label={config.label}
            isRequired={config.required}
          >
            {this.createFieldElement(departmentInfo, config)}
          </FormBox>
        );
        if (columns.length === 2) {
          rows.push(<SplitRow>{columns.concat()}</SplitRow>);
          columns = [];
        }
        // }
      });
    }
    if (columns.length !== 0) {
      rows.push(<SplitRow>{columns}</SplitRow>);
    }
    return (
      <Modal
        visible={visible}
        title={visible ? (isEdit ? '编辑部门' : '新建部门') : ''}
        onCancel={handleCancel}
        footer={[
          isEdit && (
            <div style={{ float: 'left' }}>
              <Button type="danger-light" key="delete" onClick={() => onDelete(data.id)}>
                删除部门
              </Button>
              <Button
                type="primary-light"
                key="inactive"
                onClick={() => onInvalid([departmentInfo.id])}
              >
                {`将部门${active ? '失效' : '生效'}`}
              </Button>
            </div>
          ),
          <div>
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>
            <Button disabled={formError} key="submit" type="primary" onClick={this.handleOk}>
              确认
            </Button>
          </div>,
        ]}
      >
        <Layout>{rows}</Layout>
      </Modal>
    );
  }
}
