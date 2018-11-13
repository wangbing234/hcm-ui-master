import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input as AntdInput } from 'antd';
import './Input.less';

class Input extends React.Component {
  static propTypes = {
    shadow: PropTypes.bool,
    transparent: PropTypes.bool,
    error: PropTypes.bool,
  };

  static defaultProps = {
    shadow: false,
    transparent: false,
    error: false,
  };

  render() {
    const { shadow, transparent, error, className, ...props } = this.props;
    const cls = classNames({
      [`ant-input-shadow`]: shadow,
      [`ant-input-transparent`]: transparent,
      [`ant-input-error`]: error,
      [className]: className,
    });
    return <AntdInput className={cls} {...props} />;
  }
}

export default Input;
