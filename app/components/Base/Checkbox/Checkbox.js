import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Checkbox.less';

class Checkbox extends React.Component {
  static propTypes = {
    color: PropTypes.oneOf(['primary', 'danger', 'warning', 'success', 'info', 'ink', 'dark']),
  };

  static defaultProps = {
    color: 'primary',
  };

  render() {
    const { children, color, className, ...props } = this.props;
    const cls = classNames({
      [`ant-checkbox-${color}`]: color,
      [className]: className,
    });
    return (
      <AntdCheckbox {...props} className={cls}>
        {children}
      </AntdCheckbox>
    );
  }
}

Checkbox.Group = props => {
  const { children, ...pureProps } = props;
  return <AntdCheckbox.Group {...pureProps}>{children}</AntdCheckbox.Group>;
};

export default Checkbox;
