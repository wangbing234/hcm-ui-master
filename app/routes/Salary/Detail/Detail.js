import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { SALARY_DETAIL_CLASSIFY } from 'constants/salary';

import Content from 'routes/Employee/Detail/Content';
import SideBar from 'routes/Employee/Detail/SideBar';

import Header from './Header';
import History from './History';
import MonthlyDetail from './MonthlyDetail';
import SalaryInfo from './SalaryInfo';
import SecurityInfo from './SecurityInfo';

const { MONTHLY_DETAIL, SALARY_INFO, SECURITY_INFO } = SALARY_DETAIL_CLASSIFY;

const TAB_COMPONENT_MAP = {
  [MONTHLY_DETAIL]: MonthlyDetail,
  [SALARY_INFO]: SalaryInfo,
  [SECURITY_INFO]: SecurityInfo,
};

export default class Detail extends PureComponent {

  static propTypes = {
    id: PropTypes.any, // 员工id
  };

  static defaultProps = {
    id: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      tabKey: SALARY_DETAIL_CLASSIFY.MONTHLY_DETAIL,
    };
  }

  onSwitchTab = tabKey => {
    this.setState({
      tabKey,
    });
  }

  render() {
    const { id } = this.props;
    const { tabKey } = this.state;
    const Comp = TAB_COMPONENT_MAP[tabKey];
    return [
      <Content>
        <Header actionPayload={id} tabKey={tabKey} onSwitchTab={this.onSwitchTab}/>
        <div style={{flex: 1, padding: 20, backgroundColor: '#f9f9f9'}}>
          <Comp actionPayload={id}/>
        </div>
      </Content>,
      <SideBar>
        <History actionPayload={id}/>
      </SideBar>,
    ];
  }
}
