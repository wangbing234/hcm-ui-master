import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { actions } from 'models/company';

import Company from './Company';

const { GET_COMPANIES, UPDATE_COMPANY_INFO } = actions;

const DEFAULT_STATE = {
  active: '1',
  keyword: '',
  pageNo: 1,
  pageSize: 20,
};

@connect(({ company }) => ({
  companyInfo: company.companyInfo,
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
      onRefresh: () => this.dispatch(GET_COMPANIES, this.getApiPageConfig()),
      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
        this.setState({
          pageNo: newPageNo || pageNo,
          pageSize: newPageSize || pageSize,
        });
      },

      changeState: name => val => this.setState({ [name]: val }),

      updateInfoCompany: payload => this.dispatch(UPDATE_COMPANY_INFO, payload),
    };
  }

  render() {
    return <Company {...this.props} {...this.extraProps} payload={this.state} />;
  }
}
