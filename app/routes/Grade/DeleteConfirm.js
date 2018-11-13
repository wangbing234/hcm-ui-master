import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

import { actions, ACTION_NAMES } from 'models/grade';

import Confirm from './Confirm';

const { DELETE_GRADE, UPDATE_ERROR } = actions;

@connect(({ error }) => ({
  error: error.grade,
}))
export default class DeleteConfirm extends PureComponent {
  onDelete = () => {
    const { id, onDeleted, updateInfoGrade } = this.props;
    new Promise((resolve, reject) => {
      this.dispatch(DELETE_GRADE, { id, resolve, reject });
    }).then(() => {
      onDeleted();
      this.deleteSuccess();
      this.clearError();
    });
    updateInfoGrade();
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
      [ACTION_NAMES.DELETE_GRADE]: undefined,
    });
  };

  deleteSuccess = () => {
    message.success('删除职级成功');
  };

  deleteError = errorMessage => {
    message.error(`删除失败 ，${errorMessage}`);
  };

  render() {
    const { error, id } = this.props;
    const hasError = error && error[ACTION_NAMES.DELETE_GRADE];
    if (hasError) {
      this.deleteError(hasError.message);
      this.onCancel()
    }
    return (
      <Confirm
        visible={!!id}
        title={hasError ? '无法删除职级' : '确认删除职级？'}
        hint={hasError ? '存在与职级关联的岗位，请检查！' : '是否删除该职级？请注意删除后无法恢复'}
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
