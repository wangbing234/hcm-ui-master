import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

import { actions, ACTION_NAMES } from 'models/position';

import Confirm from './Confirm';

const { DELETE_POSITION, UPDATE_ERROR } = actions;

@connect(({ error }) => ({
  error: error.position,
}))
export default class DeleteConfirm extends PureComponent {
  onDelete = () => {
    const { id, onDeleted } = this.props;
    new Promise((resolve, reject) => {
      this.dispatch(DELETE_POSITION, { id, resolve, reject });
    }).then(() => {
      onDeleted();
      this.deleteSuccess();
      this.clearError();
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.clearError();
  };

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };

  clearError = () => {
    this.dispatch(UPDATE_ERROR, {
      [ACTION_NAMES.DELETE_POSITION]: undefined,
    });
  };

  deleteSuccess = () => {
    message.success('删除岗位成功');
  };

  deleteError = errorMessage => {
    message.error(`删除失败 ，${errorMessage}`);
  };

  render() {
    const { error, id} = this.props;
    const hasError = error && error[ACTION_NAMES.DELETE_POSITION];
    if (hasError) {
      this.deleteError(hasError.message);
      this.onCancel();
      this.clearError();
    }
    return (
      <Confirm
        visible={!!id}
        title={hasError ? '无法删除岗位' : '确认删除岗位？'}
        hint={hasError ? '单位中还存在在职员工，请检查！' : '是否删除该岗位？请注意删除后无法恢复'}
        actions={[
          {
            onClick: this.onCancel,
            children: '取消',
          },
          {
            type: 'danger',
            disabled: hasError,
            onClick: this.onDelete,
            children: '删除',
          },
        ]}
      />
    );
  }
}
