import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import styles from './FullScreenDialog.less';

class SliderTool extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const { icon, disabled, onClick } = this.props;
    return (
      <div
        className={classNames(styles.toolBtn, { [styles.disable]: disabled })}
        onClick={disabled ? null : onClick}
      >
        <Icon type={icon} style={{ fontSize: 22 }} />
      </div>
    );
  }
}

export default SliderTool;
