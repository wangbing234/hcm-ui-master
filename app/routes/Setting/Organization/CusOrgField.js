import React, { Component } from 'react';
import { Layout, Table } from 'antd';
import classNames from 'classnames';
import * as Immutable from 'immutable';
import { connect } from 'dva';
import { FIELD_TYPE, TARGET_TYPE } from 'constants/field';
import { ViewStatus } from 'constants/view';
import { actions } from 'models/setting';
import { Button } from 'components/Base';
import styles from './CusOrgField.less';
import AddCusField from './AddCusField';

const { Content } = Layout;
const { Column } = Table;
const {
  GET_ORG_CUS_FIELD_LIST,
  CREATE_ORG_CUS_FIELD,
  EDIT_ORG_CUS_FIELD,
  TOGGLE_ACTIVE_ORG_CUS_FIELD,

  CHANGE_ORG_CUS_FIELD,
  ON_EDIT_ORG_CUS_FIELD,
  ON_CREATE_ORG_CUS_FIELD,
  ADD_OPTION_ORG_CUS_FIELD,
  DELETE_OPTION_ORG_CUS_FIELD,
  UPDATE_ORG_CUS_FIELD_ERROR,
} = actions;

@connect(({ setting = {}, loading }) => ({
  loading: loading.models.setting,
  ...setting,
}))
class CusOrgField extends Component {
  state = {
    isDialogOpen: false,
    status: ViewStatus.VIEW,
  };

  componentDidMount() {
    this.getFields();
  }

  onChange(type, value, index) {
    // console.log(`${type}: ${value}`);
    const { dispatch } = this.props;
    CHANGE_ORG_CUS_FIELD(dispatch, { payload: { type, value, index } });
    const errors = this.validate(type, value, index);
    UPDATE_ORG_CUS_FIELD_ERROR(dispatch, { payload: errors });
  }

  onAddOption() {
    const { dispatch } = this.props;
    ADD_OPTION_ORG_CUS_FIELD(dispatch, { payload: null });
  }

  onDeleteOption(index) {
    const { dispatch } = this.props;
    const errors = this.validate('options', '-', index );
    UPDATE_ORG_CUS_FIELD_ERROR(dispatch, { payload: errors });
    DELETE_OPTION_ORG_CUS_FIELD(dispatch, { payload: index });
  }

  onSaveField() {
    const { status } = this.state;
    const { dispatch, orgCusField } = this.props;
    const errors = this.validateAll();
    if (errors && errors.size > 0) {
      UPDATE_ORG_CUS_FIELD_ERROR(dispatch, { payload: errors });
    } else {
      let model = orgCusField;
      if (orgCusField.get('fieldType') === 'text_field') {
        model = orgCusField.delete('options');
      } else if (orgCusField.get('fieldType') === 'select') {
        model = orgCusField.delete('length').delete('placeholder');
      } else if (orgCusField.get('fieldType') === 'date') {
        model = orgCusField
          .delete('options')
          .delete('length')
          .delete('placeholder');
      }

      // console.log(model.toJS());
      if (status === ViewStatus.ADD) {
        CREATE_ORG_CUS_FIELD(dispatch, { payload: model.toJS() });
      } else if (status === ViewStatus.EDIT) {
        EDIT_ORG_CUS_FIELD(dispatch, {
          payload: model
            .delete('active')
            .delete('fieldTypeName')
            .toJS(),
        });
      }

      this.setState({
        isDialogOpen: false,
      });
    }
  }

  onCancelField() {
    this.setState({
      isDialogOpen: false,
    });
  }

  onOpenAddDialog() {
    const { dispatch } = this.props;
    ON_CREATE_ORG_CUS_FIELD(dispatch, { payload: null });
    this.setState({
      status: ViewStatus.ADD,
      isDialogOpen: true,
    });
  }

  onOpenEditDialog(data) {
    const { dispatch } = this.props;
    ON_EDIT_ORG_CUS_FIELD(dispatch, { payload: Immutable.fromJS(data) });
    this.setState({
      status: ViewStatus.EDIT,
      isDialogOpen: true,
    });
  }

  onToggleActive(id) {
    const { dispatch } = this.props;
    TOGGLE_ACTIVE_ORG_CUS_FIELD(dispatch, { payload: id });
  }

  getFields() {
    const { dispatch } = this.props;
    GET_ORG_CUS_FIELD_LIST(dispatch, { payload: null });
  }

  validate(type, value, index) {
    const { orgCusField, orgCusFieldErrors } = this.props;
    let errors = orgCusFieldErrors;
    if (type === 'idx') {
      if (!value) {
        errors = errors.set(type, '请输入序号');
      } else if (!value.match(/^\+?[1-9][0-9]*$/)) {
        // TODO
        errors = errors.set(type, '请输入数字');
      } else {
        errors = errors.delete(type);
      }
    }

    if (type === 'code') {
      if (!value) {
        errors = errors.set(type, '请输入字段编码');
      } else if (!value.match(/^[^0-9]+/)) {
        // TODO
        errors = errors.set(type, '字段编码不能够以数字开头');
      } else {
        errors = errors.delete(type);
      }
    }

    if (type === 'label') {
      if (!value) {
        errors = errors.set(type, '请输入字段名称');
      } else {
        errors = errors.delete(type);
      }
    }

    if (type === 'targetType') {
      if (!value) {
        errors = errors.set(type, '请选择所属');
      } else {
        errors = errors.delete(type);
      }
    }

    if (type === 'required') {
      if (value === '' || value === undefined) {
        errors = errors.set(type, '请选择是否必填');
      } else {
        errors = errors.delete(type);
      }
    }

    if (type === 'fieldType') {
      if (!value) {
        errors = errors.set(type, '请选择字段类型');
      } else {
        errors = errors
          .delete(type)
          .delete('placeholder')
          .delete('length');
      }
    }

    if (orgCusField.get('fieldType') === 'textField') {
      if (type === 'placeholder') {
        if (!value) {
          errors = errors.set(type, '请输入字段提示文案');
        } else {
          errors = errors.delete(type);
        }
      }

      if (type === 'length') {
        if (!value) {
          errors = errors.set(type, '请输入字段长度');
        } else if (value.match(/[^0-9]+/)) {
          // TODO
          errors = errors.set(type, '字段长度只能为数字');
        } else {
          errors = errors.delete(type);
        }
      }
    }

    if (orgCusField.get('fieldType') === 'select') {
      if (type === 'options') {
        if (!value) {
          errors = errors.setIn([type, index], '选项不能为空');
        } else {
          errors = errors.deleteIn([type, index]);
        }
      }
    }

    return errors;
  }

  validateAll() {
    const { orgCusField, orgCusFieldErrors } = this.props;
    let errors = orgCusFieldErrors;
    if (!orgCusField.get('idx')) {
      errors = errors.set('idx', '请输入序号');
    } else if (
      !orgCusField
        .get('idx')
        .toString()
        .match(/^\+?[1-9][0-9]*$/)
    ) {
      // TODO
      errors = errors.set('idx', '请输入数字');
    }

    if (!orgCusField.get('code')) {
      errors = errors.set('code', '请输入字段编码');
    } else if (!orgCusField.get('code').match(/^[^0-9]+/)) {
      // TODO
      errors = errors.set('code', '字段编码不能够以数字开头');
    }

    if (!orgCusField.get('label')) {
      errors = errors.set('label', '请输入字段名称');
    }

    if (!orgCusField.get('targetType')) {
      errors = errors.set('targetType', '请选择所属');
    }

    if (orgCusField.get('required') === '' || orgCusField.get('required') === undefined) {
      errors = errors.set('required', '请选择是否必填');
    }

    if (!orgCusField.get('fieldType')) {
      errors = errors.set('fieldType', '请选择字段类型');
    } else if (orgCusField.get('fieldType') === 'textField') {
      if (!orgCusField.get('placeholder')) {
        errors = errors.set('placeholder', '请输入字段提示文案');
      }
      if (!orgCusField.get('length')) {
        errors = errors.set('length', '请输入字段长度');
      }
    } else if(orgCusField.get('fieldType') === 'select') {
      orgCusField.get('options').map((option, index) => {
        if (!option) {
          errors = errors.setIn(['options', index], '选项不能为空');
        } else {
          errors = errors.deleteIn(['options', index]);
        }
        return option;
      });
      if (errors.get('options')){
        if(!errors.get('options').size){
          errors = errors.delete('options')
        }
      }
    }

    return errors;
  }

  renderToolBar(record) {
    return (
      <div className={styles.actions}>
        <a
          className={styles.disableBtn}
          style={{ display: record.active ? 'inline-block' : 'none' }}
          onClick={() => this.onToggleActive(record.id)}
        >
          禁用
        </a>
        <a
          className={styles.enableBtn}
          style={{ display: !record.active ? 'inline-block' : 'none' }}
          onClick={() => this.onToggleActive(record.id)}
        >
          启用
        </a>
        <a onClick={() => this.onOpenEditDialog(record)} className={styles.editBtn}>
          修改
        </a>
      </div>
    );
  }

  renderFieldsList() {
    const { loading, orgCusFields } = this.props;
    return (
      <Table
        dataSource={orgCusFields}
        size="middle"
        rowKey="id"
        loading={loading}
        showHeader={false}
        pagination={false}
        rowClassName={record => (record.active ? styles.enabled : styles.disabled)}
      >
        <Column title="序号" dataIndex="idx" key="idx" />
        <Column title="字段编码" dataIndex="code" key="code" />
        <Column title="字段名称" dataIndex="label" key="label" />
        <Column
          title="是否必填"
          dataIndex="required"
          key="required"
          render={(text, record) => (
            <div>{record && record.required === true ? '必填' : '选填'}</div>
          )}
        />
        <Column
          title="所属"
          dataIndex="targetType"
          key="targetType"
          render={(text, record) => <div>{TARGET_TYPE[record.targetType]}</div>}
        />
        <Column
          title="字段类型"
          dataIndex="fieldType"
          key="fieldType"
          render={(text, record) => <div>{FIELD_TYPE[record.fieldType]}</div>}
        />
        <Column
          title="操作"
          dataIndex="operation"
          key="operation"
          render={(text, record) => this.renderToolBar(record)}
        />
      </Table>
    );
  }

  renderAddButton() {
    return (
      <Button
        icon="plus"
        onClick={() => this.onOpenAddDialog()}
        className={classNames(styles.addFieldBtn, { 'ant-btn-block': true })}
      >
        新建自定义字段
      </Button>
    );
  }

  renderFieldDialog() {
    const { status } = this.state;
    const { orgCusField, orgCusFieldErrors } = this.props;
    return (
      <AddCusField
        visible
        data={orgCusField}
        errors={orgCusFieldErrors}
        status={status}
        onChange={(type, value, index) => this.onChange(type, value, index)}
        onAddOption={() => this.onAddOption()}
        onDeleteOption={index => this.onDeleteOption(index)}
        onOk={() => this.onSaveField()}
        onCancel={() => this.onCancelField()}
      />
    );
  }

  render() {
    const contentStyle = {
      background: '#fff',
      paddingLeft: '20px',
      paddingRight: '20px',
      marginBottom: '8px',
      overflowY: 'auto',
      overflowX: 'hidden',
    };
    const { isDialogOpen } = this.state;

    return (
      <Layout style={{ height: '100%', background: '#fff' }}>
        <div className={classNames('global-setting-title', styles.header)}>自定义字段</div>
        <Content style={contentStyle}>
          {this.renderFieldsList()}
          {this.renderAddButton()}
        </Content>
        {isDialogOpen ? this.renderFieldDialog() : null}
      </Layout>
    );
  }
}

export default CusOrgField;
