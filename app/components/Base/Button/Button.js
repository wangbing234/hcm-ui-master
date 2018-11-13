import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button as AntdButton } from 'antd';
import './Button.less';

class Button extends React.Component {
  static propTypes = {
    display: PropTypes.string,
  };

  static defaultProps = {
    display: '',
  };

  render() {
    const { children, display, className, ...props } = this.props;
    const cls = classNames({
      [`ant-btn-${display}`]: display,
      [className]: className,
    });

    return (
      <AntdButton className={cls} {...props}>
        {children}
      </AntdButton>
    );
  }
}

export default Button;
