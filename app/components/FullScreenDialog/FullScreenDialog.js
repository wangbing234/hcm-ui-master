import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './FullScreenDialog.less';

class FullScreenDialog extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    tools: PropTypes.array,
  };

  static defaultProps = {
    visible: false,
    tools: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  renderCloseButton() {
    return (
      <div className={styles.closeBtn} onClick={() => this.handleCancel()}>
        <Icon type="close" style={{ fontSize: 22 }} />
      </div>
    );
  }

  render() {
    const { children, width, visible, tools } = this.props;
    if (visible) {
      return (
        <div className={styles.mask}>
          <div style={{ width, left: -width / 2 }} className={styles.container}>
            <div className={styles.toolWrapper}>
              {this.renderCloseButton()}
              {tools}
            </div>
            <div className={styles.wrapper}>
              {children}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default FullScreenDialog;
