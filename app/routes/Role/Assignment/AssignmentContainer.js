import React, { Component } from 'react';
import { connect } from 'dva';
import { actions } from 'models/roleAssignment';
import Assignments from './Assignments';

const { GET_ROLE_EMPLOYEES } = actions;
const DEFAULT_STATE = {
  keyword: '',
  pageNo: 1,
  pageSize: 10,
};

@connect(({ roleAssignment, loading }) => ({
  rolesEmployees: roleAssignment.rolesEmployees,
  loading: loading.models.roleAssignment,
}))
export default class AssignmentsContainer extends Component {
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
      onRefresh: () => this.dispatch(GET_ROLE_EMPLOYEES, this.getApiPageConfig()),
      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
          this.setState({
            pageNo: newPageNo || pageNo,
            pageSize: newPageSize || pageSize,
          });
      },

      changeState: name => val => {
        this.setState({ [name]: val });
      },
    };
  }

  render() {
    return (
      <Assignments {...this.extraProps} {...this.props} payload={this.state} />
    );
  }
}
