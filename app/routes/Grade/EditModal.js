import React, { PureComponent } from 'react';

import { connect } from 'dva';


import { actions } from 'models/grade';
import { actions as settingActions } from 'models/setting';

import { checkId } from 'utils/utils';
import Modal from 'components/Base/Modal';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import configableFieldStrategy, { getFieldError } from 'components/Biz/ConfigableField/ConfigableField';
import FormBox from 'components/FormBox';
import { Layout, SplitRow } from 'layouts/FormLayout';

const {
  GET_GRADE,
  SAVE_GRADE,

  UPDATE_GRADE_INFO,
  UPDATE_ERROR,
} = actions;

function coverFormData2API({ parentName, ...data }, formField) {
  const temp = data;
  delete temp.createTime;
  delete temp.updateTime;
  delete temp.delete;
  temp.enableTime += ' 00:00:00';
  const apiData = {};
  Object.keys(temp).forEach(code => {
    const val = temp[code];
    if (formField.filter(field => field.id && field.code === code).length > 0) {
      apiData.customField = apiData.customField || {};
      apiData.customField[code] = val;
    } else {
      apiData[code] = val;
    }
  });
  return apiData;
}

@connect(({ grade, error }) => ({
  gradeInfo: grade.gradeInfo,
  formField: grade.formField,
  error: error.grade,
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

    this.updateCompanyInfo = payload => this.dispatch(UPDATE_GRADE_INFO, payload);

    this.createFieldElement = configableFieldStrategy(
      {
        code: (value, { placeholder }) => (
          <Input
            disabled={this.getProp('gradeInfo').id}
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
    const { gradeInfo, formField } = this.props;
    this.updateCompanyInfo({
      ...gradeInfo,
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

  handleVisibleChange = prevProps => {
    const { id, formField, gradeInfo, data } = this.props;
    const customField = (gradeInfo && gradeInfo.customField) ? gradeInfo.customField : undefined;
    const obj  = Object.assign({},gradeInfo, customField);
    delete obj.customField;
    if (data) {
    if (!prevProps.data || prevProps.data.id !== data.id) {
        const formError = {};
        if(gradeInfo && gradeInfo.customField)
        {
          formField.forEach(({ required, code }) => {
            formError[code] = required && !(obj && obj[code]);
          });
        }
        else{
          formField.forEach(({ required, code }) => {
            formError[code] = required && !(gradeInfo && gradeInfo[code]);
          });
        }
        this.updateFormError(formError);

        this.dispatch(settingActions.GET_ORG_CUS_FIELD_LIST);
        if (id) {
          this.dispatch(GET_GRADE, id);
        } else {
          this.updateCompanyInfo(data);
        }
      }
    }
    else if(prevProps.data) {
     this.updateCompanyInfo();
   }
  };

  updateFormError = payload => {
    const { error } = this.props;
    const { form } = error || {};
    let newFormError = { ...form };
    let hasChange = false;
    Object.keys(payload).forEach(code => {
      const msg = payload[code];
      if (newFormError[code] !== msg) {
        hasChange = true;
        if (msg) {
          newFormError[code] = msg;
        } else {
          delete newFormError[code];
        }
      }
    });

    if (Object.keys(newFormError).length === 0) {
      newFormError = undefined;
    }

    if (hasChange) {
      this.dispatch(UPDATE_ERROR, {
        form: newFormError,
      });
    }
  };

  handleOk = () => {
    const { gradeInfo, handleOk, formField } = this.props;
    new Promise((resolve, reject) => {
      this.dispatch(SAVE_GRADE, {
        grade: coverFormData2API(gradeInfo, formField),
        resolve,
        reject,
      });
    }).then(handleOk).catch( e => {
      if( e && e.meta ) {
        const { code, message } = e.meta;
        switch(code) {
          case "12402":
            this.updateFormError({
              code: message,
            });
            break;
          default:
        }
      }
    })
    ;
  };

  render() {
    const {
      handleCancel,
      formField,
      data,
      error,
      onDelete,
      onInvalid,
      gradeInfo,
      active,
    } = this.props;

    const visible = !!data;
    const isEdit = visible && !!data.id;
    const rows = [];
    let columns = [];
    const formError = error && error.form;
    if (gradeInfo && formField) {
      formField.forEach((config,index) => {
        const key = index;

        if (!isEdit || gradeInfo.parentId || config.code !== 'parentId') {
          columns.push(
            <FormBox
              key={key}

              errorMsg={formError && formError[config.code]}
              label={config.label}
              isRequired={config.required}
            >
              {this.createFieldElement(gradeInfo, config)}
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
        title={visible ? (isEdit ? '编辑职级' : '新建职级') : ''}
        onCancel={handleCancel}
        footer={[
          isEdit && (
            <div style={{ float: 'left' }}>
              <Button type="danger-light" key="delete" onClick={() => onDelete(gradeInfo.id)}>
                删除职级
              </Button>
              <Button type="primary-light" key="inactive" onClick={() => onInvalid(gradeInfo.id)}>
                {`将职级${active ? '失效' : '生效'}`}
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
