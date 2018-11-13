import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message  } from 'antd';
import { checkId } from 'utils/utils';
import { createPromiseDispatch } from 'utils/actionUtil';
import { actions, ACTION_NAMES   } from 'models/company';
import { actions as settingActions } from 'models/setting';
import { Modal, Button, Input } from 'components/Base/';
import OrgTreeSelect from 'components/OrgTreeSelect';
import configableFieldStrategy, { getFieldError } from 'components/Biz/ConfigableField/ConfigableField';
import FormBox from 'components/FormBox';
import { Layout, SplitRow } from 'layouts/FormLayout';

const {
  GET_COMPANY_TREE,
  GET_COMPANY,
  CREATE_COMPANY,
  UPDATE_COMPANY,

  UPDATE_COMPANY_INFO,
  UPDATE_ERROR,
} = actions;

function coverFormData2API({ parentName, ...data }, formField) {
  const apiData = {};
  Object.keys(data).forEach(code => {
    let val = data[code];
    if (formField.filter(field => field.id && field.code === code).length > 0) {
      apiData.customField = apiData.customField || {};
      apiData.customField[code] = val;
    } else {
      if (code === 'enableTime') {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      }
      apiData[code] = val;
    }
  });
  return apiData;
}

function formatCompanyTree(company, disabledCB) {
  return company && {
    ...company,
    disabled: company.disabled || disabledCB(company),
    children: company.children.map(child => formatCompanyTree(child, disabledCB)),
  };
}

@connect(({ company, error, loading }) => ({
  loadingGetCompany: loading.effects['company/GET_COMPANY'],
  companyInfo: company.companyInfo,
  companyTree: formatCompanyTree(company.companyTree, ({value} = {}) => value === `${(company.companyInfo || {}).id}` ),
  formField: company.formField,
  error: error.company,
}))
export default class EditModal extends PureComponent {
  constructor(props) {
    super(props);

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.promiseDispatch = createPromiseDispatch();

    this.getProp = name => {
      const { [name]: prop } = this.props;
      return prop;
    };

    this.updateCompanyInfo = payload => this.dispatch(UPDATE_COMPANY_INFO, payload);

    this.createFieldElement = configableFieldStrategy(
      {
        parentId: _value => {
          const isTopParent = _value === -1;
          const value = isTopParent ? undefined : _value;

          return (
            <OrgTreeSelect
              disabled={isTopParent}
              showSearch
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={[this.getProp('companyTree')]}
              placeholder="请选择"
              treeDefaultExpandAll
              onChange={parentId => parentId && this.onChange('parentId', parentId)}
            />
          );
        },
        code: (value, { placeholder }) => (
          <Input
            disabled={this.getProp('companyInfo').id}
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
    const { companyInfo, formField } = this.props;
    this.updateCompanyInfo({
      ...companyInfo,
      [code]: value,
    });
    let error = getFieldError( value, formField.find(config => config.code === code) );
    if( !error ) {
      if( code === 'code' ) {
        if( !checkId(value) ) {
          error = '请输入小于8位的字母或数字';
        }
      }
    }
    this.updateFormError({
      [code]: error,
    });
  };

  fieldExceptions = {
    parentId: value => (
      <OrgTreeSelect
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.getProp('companyTree')}
        placeholder="请选择"
        treeDefaultExpandAll
        onChange={parentId => this.onChange('parentId', parentId)}
      />
    ),
    code: (value, { placeholder }) => (
      <Input
        disabled={this.getProp('companyInfo').id}
        placeholder={placeholder}
        value={value}
        onChange={e => this.onChange('code', e.target.value)}
      />
    ),
  }

  handleVisibleChange = prevProps => {
    const { formField, companyInfo, data, loadingGetCompany } = this.props;
    const prevVisable = !!prevProps.data;
    const visable = !!data;
    if (prevVisable !== visable) {
      if (visable) {
        this.dispatch(GET_COMPANY_TREE);
        this.dispatch(settingActions.GET_ORG_CUS_FIELD_LIST);
        if (data.id) {
          this.dispatch(GET_COMPANY, data.id);
        } else {
          this.updateCompanyInfo(data);
        }

      } else {
        this.updateCompanyInfo();
      }
    }

    if(data){
      if (!prevProps.data || prevProps.data.id !== data.id || (prevProps.loadingGetCompany && !loadingGetCompany) ) {
        const formError = {};
        const customField = (companyInfo && companyInfo.customField) ? companyInfo.customField : undefined;
        const obj  = Object.assign({},companyInfo, customField);
        if( obj ) {
          formField.forEach(({ required, code }) => {
            formError[code] = required && !obj[code];
          });
        }
        this.updateFormError(formError);
      }
    }
  };

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
      [`${ACTION_NAMES.UPDATE_COMPANY}/promise`]: undefined,
    });
  };

  handleOk = () => {
    const { companyInfo, handleOk, formField } = this.props;
    this.promiseDispatch(
      companyInfo.id ? UPDATE_COMPANY : CREATE_COMPANY,
      coverFormData2API(companyInfo, formField)
    ).then(handleOk).catch( e => {
      if( e && e.meta ) {
        const { code } = e.meta;
        switch(code) {
          case "12402":
            this.updateFormError({
              code: e.meta.message,
            });
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
      data,
      error,
      onDelete,
      onInvalid,
      companyInfo,
      active,
      companyTree,
    } = this.props;
    const visible = !!data;
    const isEdit = visible && !!data.id;
    const rows = [];
    let columns = [];
    const hasError = error && error[`${ACTION_NAMES.UPDATE_COMPANY}/promise`];
    const formError = error && error.form;

    if(hasError){
      this.editError(hasError.message);
      this.clearError();
    }
    if (companyInfo && formField && companyTree) {
      formField.forEach((config, index) => {
        const key = index;
        if (!isEdit || companyInfo.parentId || config.code !== 'parentId') {
          columns.push(
            <FormBox
              key={key}
              errorMsg={formError && formError[config.code]}
              label={config.label}
              isRequired={config.required}
            >
              {this.createFieldElement(companyInfo, config)}
            </FormBox>
          );
          if (columns.length === 2) {
            rows.push(<SplitRow key={key}>{columns.concat()}</SplitRow>);
            columns = [];
          }
        }
      });
    }
    if (columns.length !== 0) {
      rows.push(<SplitRow key="splitRow">{columns}</SplitRow>);
    }

    return (
      <Modal
        zIndex={1}
        visible={visible}
        title={visible ? (isEdit ? '编辑公司' : '新建公司') : ''}
        onCancel={handleCancel}
        footer={[
          isEdit && (
            <div style={{ float: 'left' }}>
              <Button type="danger-light" key="delete" onClick={() => onDelete(companyInfo.id)}>
                删除公司
              </Button>
              <Button
                type="primary-light"
                key="inactive"
                onClick={() => onInvalid([companyInfo.id])}
              >
                {`将公司${active ? '失效' : '生效'}`}
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
