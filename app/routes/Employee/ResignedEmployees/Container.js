import React, { Component } from 'react';
import { connect } from 'dva';
import { actions } from 'models/getEmployees';
import ResignedEmployees from './ResignedEmployees';

const { GET_RESIGNED_EMPLOYEES } = actions;

@connect(({ getEmployees, loading }) => ({
  resignedEmployees: getEmployees.resignedEmployees,
  loading: loading.models.getEmployees,
}))
class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'former',
      keyword: '',
      pageNo: 1,
      pageSize: 20,
    };

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.extra = {
      onRefresh: () => this.dispatch(GET_RESIGNED_EMPLOYEES, this.state),

      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
        this.setState({
          pageNo: newPageNo || pageNo,
          pageSize: newPageSize || pageSize,
        });
      },

      onEdit: () => {
        // 更新员工详情，员工详情为空对象的时候，弹框不显示
      },

      changeState: (name, val) => {
        this.setState({ [name]: val });
      },

      onChange: key => {
        this.setState({ status: key });
      },
    };
  }

  render() {
    return <ResignedEmployees {...this.extra} payload={this.state} {...this.props} />;
  }
}

export default Container;
