import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { actions } from 'models/department';

import Department from './Department';

const {
  GET_DEPARTMENTS,
  // DELETE_DEPARTMENT,
  // INVALID_DEPARTMENT,

  UPDATE_DEPARTMENT_INFO,
  // GET_ORG_CUS_FIELDS,
  // UPDATE_CONFIRM_INFO,
} = actions;

const DEFAULT_STATE = {
  active: '1',
  keyword: '',
  pageNo: 1,
  pageSize: 20,
};

@connect(({ department }) => ({
  departmentInfo: department.departmentInfo,
  // confirmInfo: department.confirmInfo,
  // error: error.models.department,
}))
export default class CompanyContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    this.getApiPageConfig = () => {
      return this.state;
    };

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.extraProps = {
      onRefresh: () => this.dispatch(GET_DEPARTMENTS, this.getApiPageConfig()),
      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
        this.setState({
          pageNo: newPageNo || pageNo,
          pageSize: newPageSize || pageSize,
        });
      },

      changeState: name => val => this.setState({ [name]: val }),

      updateDepartmentInfo: payload => {
        this.dispatch(UPDATE_DEPARTMENT_INFO, payload);
      },
    };
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   GET_ORG_CUS_FIELDS(dispatch, {});
  // }

  render() {
    return <Department {...this.props} {...this.extraProps} payload={this.state} />;
  }
}
