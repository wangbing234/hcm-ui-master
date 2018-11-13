import React from 'react';
import { Dropdown as AntdDropdown } from 'antd';
import './Dropdown.less';

class Dropdown extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return <AntdDropdown {...props}>{children}</AntdDropdown>;
  }
}

Dropdown.Button = props => {
  const { children, ...pureProps } = props;
  return <AntdDropdown.Button {...pureProps}>{children}</AntdDropdown.Button>;
};

export default Dropdown;
