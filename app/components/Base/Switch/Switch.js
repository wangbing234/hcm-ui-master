import React from 'react';
import { Switch as AntdSwitch } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Switch.less';

class Switch extends React.Component {
  static propTypes = {
    color: PropTypes.oneOf(['primary', 'danger', 'warning', 'success', 'info', 'ink', 'dark']),
  };

  static defaultProps = {
    color: 'primary',
  };

  render() {
    const { children, color, ...props } = this.props;
    const cls = classNames({
      [`ant-switch-${color}`]: color,
    });
    return (
      <AntdSwitch {...props} className={cls}>
        {children}
      </AntdSwitch>
    );
  }
}

export default Switch;
