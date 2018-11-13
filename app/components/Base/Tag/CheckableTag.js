import React from 'react';
import { Tag as AntdTag } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Tag.less';

class CheckableTag extends React.Component {
  static propTypes = {
    color: PropTypes.string,
  };

  static defaultProps = {
    color: 'primary',
  };

  state = {
    checked: false,
  };

  handleChange = checked => {
    this.setState({ checked });
  };

  render() {
    const { color, ...props } = this.props;
    const { checked } = this.state;
    const cls = classNames({
      [`ant-tag-checkable-${color}`]: color,
    });
    return (
      <AntdTag.CheckableTag
        {...props}
        className={cls}
        checked={checked}
        onChange={this.handleChange}
      />
    );
  }
}

export default CheckableTag;
