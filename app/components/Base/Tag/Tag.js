import React from 'react';
import { Tag as AntdTag } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Tag.less';

class Tag extends React.Component {
  static propTypes = {
    color: PropTypes.string,
  };

  static defaultProps = {
    color: '',
  };

  render() {
    const { children, color, ...props } = this.props;
    const cls = classNames({
      [`ant-tag-${color}`]: color,
    });
    return (
      <AntdTag className={cls} {...props}>
        {children}
      </AntdTag>
    );
  }
}

export default Tag;
