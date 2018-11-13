import React from 'react';
import { Radio as AntdRadio } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Radio.less';

class Radio extends React.Component {
  static propTypes = {
    color: PropTypes.oneOf(['primary', 'danger', 'warning', 'success', 'info', 'ink', 'dark']),
  };

  static defaultProps = {
    color: 'primary',
  };

  render() {
    const { children, color, ...props } = this.props;
    const cls = classNames({
      [`ant-radio-${color}`]: color,
    });
    return (
      <AntdRadio {...props} className={cls}>
        {children}
      </AntdRadio>
    );
  }
}

Radio.Group = props => {
  const { children, ...pureProps } = props;
  return <AntdRadio.Group {...pureProps}>{children}</AntdRadio.Group>;
};

Radio.Button = props => {
  const { children, ...pureProps } = props;
  return <AntdRadio.Button {...pureProps}>{children}</AntdRadio.Button>;
};

export default Radio;
