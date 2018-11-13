import React, { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import ActionBtn from './ActionBtn';
import styles from './Confirm.less';

export class ConfirmComponent extends PureComponent {

  static propTypes = {
    onOk: PropTypes.func,  // 确认回调
    onCancel: PropTypes.func, // 取消回调
    okText: PropTypes.string, // 确认文本
    cancelText: PropTypes.string, // 取消文本
    title: PropTypes.string.isRequired, // 标题
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // 内容
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 宽度
  };

  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    okText: '确定',
    cancelText: '取消',
    content: '',
    width: 600,
  }

  render() {
    const {
      onOk,
      onCancel,
      okText,
      cancelText,
      title,
      content,
      width,
      visible,
      close,
      ...rest
    } = this.props;

    // 底部按钮
    const renderFooter = () => {
      const okBtn = onOk && (
        <ActionBtn
          type="danger"
          action={onOk}
          close={close}
        >
          {okText}
        </ActionBtn>
      );

      const cancelBtn = onCancel && (
        <ActionBtn
          action={onCancel}
          close={close}
        >
          {cancelText}
        </ActionBtn>
      );

      return (
        <footer className={styles.footer}>
          {cancelBtn}
          {okBtn}
        </footer>
      )
    };

    return (
      <Modal
        wrapClassName={styles.confirm}
        footer={null}
        width={width}
        visible={visible}
        onCancel={close.bind(this, { triggerCancel: true })}
        {...rest}
      >
        <div className={styles.wrapper}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>{content}</div>
        </div>
        { renderFooter() }
      </Modal>
    );
  }
}


export function confirm(config) {
  const IS_REACT_16 = !!ReactDOM.createPortal;
  const div = document.createElement('div');
  document.body.appendChild(div);
  let currentConfig = { ...config, close, visible: true };

  function close(...args) {
    currentConfig =  {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args),
    };
    if (IS_REACT_16) {
      render(currentConfig);
    } else {
      destroy(...args);
    }
  }

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args && args.length &&
      args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }

  function render(props) {
    ReactDOM.render(<ConfirmComponent {...props} />, div);
  }

  render(currentConfig);

  return {
    destroy: close,
    update,
  };
}
