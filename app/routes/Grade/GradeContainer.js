import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { actions } from 'models/grade';

import Grade from './Grade';

const { GET_GRADES, UPDATE_GRADE_INFO } = actions;

const DEFAULT_STATE = {
  active: '1',
  keyword: '',
  pageNo: 0,
  pageSize: 20,
};

@connect(({ grade }) => ({
  gradeInfo: grade.gradeInfo,
}))
export default class GradeContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.extraProps = {
      onRefresh: () => this.dispatch(GET_GRADES, this.state),
      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
        this.setState({
          pageNo: newPageNo || pageNo,
          pageSize: newPageSize || pageSize,
        });
      },

      changeState: name => val => this.setState({ [name]: val }),

      updateInfoGrade: payload => this.dispatch(UPDATE_GRADE_INFO, payload),
    };
  }

  render() {
    return <Grade {...this.props} {...this.extraProps} payload={this.state} />;
  }
}
