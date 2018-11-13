import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

import { actions, ACTION_NAMES } from 'models/grade';

import Confirm from './Confirm';

const { INACTIVE_GRADE, UPDATE_ERROR } = actions;

@connect(({ error }) => ({
  error: error.grade,
}))
export default class ActiveConfirm extends PureComponent {
  onActive = () => {
    const { ids, handleOk, isActive, updateInfoGrade } = this.props;
    new Promise((resolve, reject) => {
      this.dispatch(INACTIVE_GRADE, {
        data: {
          enable: +!isActive,
          id: typeof(ids) === 'number'? [ids] : ids,
        },
        resolve,
        reject,
      });
    })
      .then(() => {
        handleOk();
        this.clearError();
        this.activeSuccess();
      })
      .catch(e => {
        window.console.log(e);
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
      [ACTION_NAMES.INACTIVE_GRADE]: undefined,
    });
  };

  activeSuccess = () => {
    const {clearRowkeys} = this.props
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
    const hasError = error && error[ACTION_NAMES.INACTIVE_GRADE];
    const actionName = isActive ? '失效' : '生效';
    if (hasError) {
      this.activeError(hasError.message, actionName);
      this.onCancel()
    }
    return (
      <Confirm
        visible={!!ids}
        title={`确认${actionName}职级?`}
        hint={
          hasError
            ? `关联的岗位还未${actionName}，请检查`
            : `确认${actionName}职级?${actionName}后可以重新恢复`
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
