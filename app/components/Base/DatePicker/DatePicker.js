import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DatePicker as AntdDatePicker } from 'antd';
import './DatePicker.less';

class DatePicker extends React.Component {
  static propTypes = {
    error: PropTypes.bool,
    transparent: PropTypes.bool,
  };

  static defaultProps = {
    error: false,
    transparent: false,
  };

  render() {
    const { error, transparent , className, ...props } = this.props;
    const cls = classNames({
      [`ant-calendar-picker-error`]: error,
      [`ant-calendar-picker-transparent`]: transparent,
      [className]: className,
    });
    return <AntdDatePicker className={cls} {...props} />;
  }
}

export default DatePicker;
