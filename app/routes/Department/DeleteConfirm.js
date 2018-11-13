import React, { PureComponent } from 'react';
import { message } from 'antd';
import { connect } from 'dva';

import { createPromiseDispatch } from 'utils/actionUtil';
import { actions, ACTION_NAMES } from 'models/department';

import Confirm from './Confirm';

const { DELETE_DEPARTMENT, UPDATE_ERROR } = actions;

@connect(({ error }) => ({
  error: error.department,
}))
export default class DeleteConfirm extends PureComponent {
  onDelete = () => {
    const { id, onDeleted } = this.props;
    this.promiseDispatch(DELETE_DEPARTMENT, id).then(() => {
      onDeleted();
      this.deleteSuccess();
      this.clearError();
    }).catch(e =>{
      if(e.meta.message){
        this.deleteError(e.meta.message);
        this.onCancel();
      }
    });
  };


  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.clearError();
  };

  promiseDispatch = createPromiseDispatch();

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };

  clearError = () => {
    this.dispatch(UPDATE_ERROR, {
      [ACTION_NAMES.DELETE_DEPARTMENT]: undefined,
    });
  };

  deleteSuccess = () => {
    message.success('删除成功');
  };

  deleteError = errorMessage => {
    message.error(`删除失败 ，${errorMessage}`);
  };

  render() {
    const { error, id} = this.props;
    const hasError = error && error[ACTION_NAMES.DELETE_DEPARTMENT];
    return (
      <Confirm
        visible={!!id}
        title={hasError ? '无法删除部门' : '确认删除部门？'}
        hint={hasError ? '单位中还存在在职员工，请检查！' : '是否删除该部门？请注意删除后无法恢复'}
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
