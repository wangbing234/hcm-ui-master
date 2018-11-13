import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select as AntdSelect } from 'antd';
import './Select.less';

class Select extends React.Component {
  static propTypes = {
    shadow: PropTypes.bool,
    transparent: PropTypes.bool,
    error: PropTypes.bool,
    number2boolean: PropTypes.bool, // 数字是否转换成布尔值
    defaultActiveFirstOption: PropTypes.bool, // 是否默认高亮第一个选项
    onChange: PropTypes.func,
  };

  static defaultProps = {
    shadow: false,
    transparent: false,
    error: false,
    number2boolean: false,
    defaultActiveFirstOption: false,
    onChange: () => {},
  };

  // 数字 0 / 1 处理成 false / true
  handleChange = value => {
    const { onChange } = this.props;
    if (value === 0 || value === 1) {
      onChange(!!value);
      return;
    }
    onChange(value);
  };

  // false / true 处理成 数字 0 / 1
  handleValue = value => {
    if (value === true || value === false) {
      return value - 0;
    } else {
      return value;
    }
  };

  render() {
    const {
      shadow,
      transparent,
      error,
      number2boolean,
      className,
      ...props
    } = this.props;

    const cls = classNames({
      [`ant-select-shadow`]: shadow,
      [`ant-select-transparent`]: transparent,
      [`ant-select-error`]: error,
      [className]: className,
    });

    if (number2boolean) {
      return (
        <AntdSelect
          {...props}
          onChange={this.handleChange}
          className={cls}
          value={this.handleValue(this.props.value)}
        />
      );
    }
    // 弹出的选择的最小宽度为140px（HCM UI问题 27）
    return (
      <AntdSelect
        className={cls}
        {...props} />
    );
  }
}

export default Select;
