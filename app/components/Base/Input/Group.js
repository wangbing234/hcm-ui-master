import React from 'react';
import { Input as AntdInput } from 'antd';
import './Input.less';

class Search extends React.PureComponent {
  render() {
    const { children, ...pureProps } = this.props;
    return <AntdInput.Group {...pureProps}>{children}</AntdInput.Group>;
  }
}

export default Search;
