import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

import { createPromiseDispatch } from 'utils/actionUtil';
import { actions, ACTION_NAMES } from 'models/department';

import Confirm from './Confirm';

const { INVALID_DEPARTMENT, UPDATE_ERROR } = actions;

@connect(({ error }) => ({
  error: error.department,
}))
export default class ActiveConfirm extends PureComponent {
  onActive = () => {
    const { ids, handleOk, isActive } = this.props;
    const actionName = isActive ? '失效' : '生效';
    this.promiseDispatch(INVALID_DEPARTMENT, {
      enable: +!isActive,
      id: typeof ids === 'object' ? ids : [ids],
    })
    .then(() => {
      handleOk();
      this.clearError();
      this.activeSuccess();
    }).catch(e => {
      if(e.meta.message){
        this.activeError(e.meta.message, actionName);
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
      [ACTION_NAMES.INVALID_DEPARTMENT]: undefined,
    });
  };

  activeSuccess = () => {
    const { clearRowkeys } = this.props
    message.success('操作成功');
    if(typeof clearRowkeys === 'function'){
      clearRowkeys()
    }
  };

  activeError = (errorMessage, name) => {
    message.error(`${name}失败 ，${errorMessage}`);
  };

  render() {
    const { error, ids, isActive} = this.props;
    const hasError = error && error[ACTION_NAMES.INVALID_DEPARTMENT];
    const actionName = isActive ? '失效' : '生效';
    return (
      <Confirm
        visible={!!ids}
        title={`确认${actionName}部门?`}
        hint={
          hasError
            ? `下属单位还未${actionName}，请检查`
            : `确认${actionName}部门?${actionName}后可以重新恢复`
        }
        actions={[
          {
            onClick: this.onCancel,
            children: '取消',
          },
          {
            type: 'danger',
            disabled: hasError,
            onClick: this.onActive,
            children: actionName,
          },
        ]}
      />
    );
  }
}
