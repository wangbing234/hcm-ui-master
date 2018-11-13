import React from 'react';
import { Pagination as AntdPagination } from 'antd';
import './Pagination.less';

class Pagination extends React.Component {
  render() {
    return <AntdPagination {...this.props} />;
  }
}

export default Pagination;
