import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { actions } from 'models/personnel';

import Confirm from './Confirm';

const { DELETE_PERSONNEL } = actions;

@connect(state => state)
export default class DeleteConfirm extends PureComponent {
  onDelete = () => {
    const { id, onDeleted } = this.props;
    new Promise((resolve, reject) => {
      this.dispatch(DELETE_PERSONNEL, { id, resolve, reject });
    }).then(() => {
      onDeleted();
    });
    // onRefresh();
  };

  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };

  render() {
    const { error, id } = this.props;
    const hasError = error;

    return (
      <Confirm
        key={id}
        visible={!!id}
        title="确认删除？"
        hint={hasError ? '' : '是否删除？请注意删除后无法恢复'}
        actions={[
          {
            onClick: this.onCancel,
            children: '取消',
          },
          {
            type: 'danger',
            onClick: this.onDelete,
            children: '删除',
          },
        ]}
      />
    );
  }
}
