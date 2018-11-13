import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input as AntdInput } from 'antd';
import './Input.less';

class TextArea extends React.PureComponent {
  static propTypes = {
    shadow: PropTypes.bool,
    transparent: PropTypes.bool,
  };

  static defaultProps = {
    shadow: false,
    transparent: false,
  };

  render() {
    const { shadow, transparent, className, ...props } = this.props;
    const cls = classNames({
      [`ant-input-shadow`]: shadow,
      [`ant-input-transparent`]: transparent,
      [className]: className,
    });
    return <AntdInput.TextArea className={cls} {...props} />;
  }
}

export default TextArea;
