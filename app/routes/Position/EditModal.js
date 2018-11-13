import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import { actions, ACTION_NAMES  } from 'models/position';
import { actions as settingActions } from 'models/setting';
import { checkId } from 'utils/utils';
import { Modal, Button, Input, Select } from 'components/Base/';
import configableFieldStrategy, { getFieldError } from 'components/Biz/ConfigableField/ConfigableField';
import OrgTreeSelect from 'components/OrgTreeSelect';
import FormBox from 'components/FormBox';
import { Layout, SplitRow } from 'layouts/FormLayout';

const { Option } = Select;

const {
  GET_POSITION_TREE,
  GET_POSITION,
  GET_POSITIONS,
  SAVE_POSITION,
  GET_GRADES,
  UPDATE_POSITION_INFO,
  UPDATE_ERROR,
} = actions;

const DEFAULT_STATE = {
  active: '1',
  keyword: '',
  pageNo: 1,
  pageSize: 20,
};

function coverFormData2API({ parentName, ...data }, formField) {
  const temp = data;
  temp.enableTime += ' 00:00:00';
  delete temp.master;
  delete temp.departmentName;
  delete temp.parentPositionName;
  delete temp.gradeName;
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

@connect(({ position, error }) => ({
  positionInfo: position.positionInfo,
  positionTree: position.positionTree,
  positionList: position.positionList,
  getGrades: position.getGrades,
  formField: position.formField,
  error: error.position,
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
    this.updatePositionInfo = payload =>
      this.dispatch(UPDATE_POSITION_INFO, payload);

    this.createFieldElement = configableFieldStrategy(
      {
        departmentId: value => {
          const treeData = this.getProp('positionTree');
          if (treeData) {
            return (
              <OrgTreeSelect
                value={value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={[treeData]}
                placeholder="请选择"
                searchPlaceholder="请输入"
                treeDefaultExpandAll
                showSearch
                onChange={(_value, _, extra) => {
                  const { props: _props } = extra.triggerNode;
                  this.onChange('departmentId', _value, {
                    code: 'master',
                    value: _props.master,
                  });
                }}
              />
            )
          }
        },
        parentPositionName: value => (
          <Select
            onSelect={parentPositionId => {
              this.onChange('parentPositionName', parentPositionId, {
                code: 'parentPositionId',
                value: parentPositionId,
              });
            }}
            style={{ width: '100%' }}
            value={value}
            showSearch
            optionFilterProp="children"
            placeholder="请选择"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          >
            <Option key="null">无</Option>
            {this.getProp('positionList') &&
            this.getProp('positionList').content
              ? this.getProp('positionList').content.map(item => (
                  // eslint-disable-next-line
                  <Option key={item.id}>{item.name}</Option>
                ))
              : null}
          </Select>
        ),
        gradeName: value => (
          <Select
            onSelect={gradeId => {
              this.onChange('gradeName', gradeId, {
                code: 'gradeId',
                value: gradeId,
              });
            }}
            style={{ width: '100%' }}
            value={value}
            placeholder="请选择"
            showSearch
            optionFilterProp="children"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          >
            {this.getProp('getGrades') && this.getProp('getGrades').content
              ? this.getProp('getGrades').content.map(item => (
                  // eslint-disable-next-line
                  <Option
                    key={item.id}
                    disabled={
                      item.enableTime > this.getProp('positionInfo').enableTime
                    }
                  >
                    {item.name}
                  </Option>
                ))
              : null}
          </Select>
        ),

        master: value => (
          <Input placeholder="禁止输入" value={value} disabled />
        ),
        gradeId: value => (
          <Input placeholder="禁止输入" value={value} disabled />
        ),
        parentPositionId: value => (
          <Input placeholder="禁止输入" value={value} disabled />
        ),
        code: (value, { placeholder }) => (
          <Input
            disabled={this.getProp('positionInfo').id}
            placeholder={placeholder}
            value={value}
            onChange={e => this.onChange('code', e.target.value)}
          />
        ),
      },
      this.onChange,
    );
  }

  componentDidMount() {
    this.handleVisibleChange({});
  }

  componentDidUpdate(prevProps) {
    this.handleVisibleChange(prevProps);
  }

  onChange = (code, value, extra = {}) => {
    const { positionInfo, formField, getGrades } = this.props;
    const newPosInfo = {
      ...positionInfo,
      [code]: value,
      [extra.code]: extra.value,
    };
    const error = {
      [code]: getFieldError(
        value,
        formField.find(config => config.code === code),
      ),
    };
    if (code === 'enableTime' && getGrades && getGrades.content) {
      getGrades.content.forEach(({ id, enableTime }) => {
        if (`${id}` === positionInfo.gradeId && enableTime > value) {
          newPosInfo.gradeId = undefined;
          newPosInfo.gradeName = undefined;
          error.gradeName = true;
        }
      });
    }
    this.updatePositionInfo(newPosInfo);
    if( !error[code] ) {
      if( code === 'code' ) {
        if( !checkId(value) ) {
          error[code] = '请输入小于8位的字母或数字';
        }
      }
    }
    this.updateFormError(error);
  };

  handleVisibleChange = prevProps => {
    const { formField, positionInfo, data } = this.props;
    const customField =
      positionInfo && positionInfo.customField
        ? positionInfo.customField
        : undefined;
    const obj = Object.assign({}, positionInfo, customField);
    delete obj.customField;
    if (data) {
      if (!prevProps.data || prevProps.data.id !== data.id) {
        const formError = {};
        if (positionInfo && positionInfo.customField) {
          formField.forEach(({ required, code }) => {
            formError[code] = required && !(obj && obj[code]);
          });
        } else {
          formField.forEach(({ required, code }) => {
            formError[code] = required && !(positionInfo && positionInfo[code]);
          });
        }
        this.updateFormError(formError);
        this.dispatch(GET_GRADES, DEFAULT_STATE);
        this.dispatch(GET_POSITIONS, DEFAULT_STATE);
        this.dispatch(GET_POSITION_TREE);
        this.dispatch(settingActions.GET_ORG_CUS_FIELD_LIST);
        if (data.id) {
          this.dispatch(GET_POSITION, data.id);
        } else {
          this.updatePositionInfo(data);
        }
      }
    } else if (prevProps.data) {
      this.updatePositionInfo();
    }
  };

  editError = errorMessage => {
    message.error(errorMessage);
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

  clearError = () => {
    this.dispatch(UPDATE_ERROR, {
      [ACTION_NAMES.SAVE_POSITION]: undefined,
    });
  };

  handleOk = () => {
    const { positionInfo, handleOk, formField } = this.props;
    new Promise((resolve, reject) => {
      this.dispatch(SAVE_POSITION, {
        position: coverFormData2API(positionInfo, formField),
        resolve,
        reject,
      });
    })
    .then(res => {
      handleOk(res);
    })
    .catch(e => {
      if( e && e.meta ) {
        const { code } = e.meta;
        switch(code) {
          case "12308":
            this.updateFormError({
              code: e.meta.message,
            });
            break;
          case '12305':
            this.updateFormError({
              parentPositionName: e.meta.message,
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
      data,
      error,
      onDelete,
      onInvalid,
      positionInfo,
      active,
    } = this.props;
    const visible = !!data;
    const isEdit = visible && !!data.id;
    const rows = [];
    let columns = [];
    const formError = error && error.form;
    if (positionInfo && formField) {
      formField.forEach(config => {
        if (
          !isEdit ||
          positionInfo.departmentId ||
          config.code !== 'departmentId'
        ) {
          columns.push(
            <FormBox
              errorMsg={formError && formError[config.code]}
              label={config.label}
              isRequired={config.required}
            >
              {this.createFieldElement(positionInfo, config)}
            </FormBox>,
          );
          if (columns.length === 2) {
            rows.push(<SplitRow>{columns.concat()}</SplitRow>);
            columns = [];
          }
        }
      });
    }
    if (columns.length !== 0) {
      rows.push(<SplitRow>{columns}</SplitRow>);
    }
    return (
      <Modal
        zIndex={1}
        visible={visible}
        title={visible ? (isEdit ? '编辑岗位' : '新建岗位') : ''}
        onCancel={handleCancel}
        footer={[
          isEdit && (
            <div style={{ float: 'left' }}>
              <Button
                type="danger-light"
                key="delete"
                onClick={() => onDelete(positionInfo.id)}
              >
                删除岗位
              </Button>
              <Button
                type="primary-light"
                key="inactive"
                onClick={() => onInvalid(positionInfo.id)}
              >
                {`将岗位${active ? '失效' : '生效'}`}
              </Button>
            </div>
          ),
          <div>
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>
            <Button
              disabled={formError}
              key="submit"
              type="primary"
              onClick={this.handleOk}
            >
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
