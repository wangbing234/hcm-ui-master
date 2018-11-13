import React, { PureComponent } from 'react';

import { SALARY_EMPLOYEE_STATUS } from 'constants/salary';

import DetailDialog from 'routes/Employee/Detail/DetailDialog';

import Header from './Header';
import Table, { WITHOUT_FORMER_COLUMNS, ALL_COLUMNS } from './Table';
import Detail from '../Detail';

import styles from './List.less';

const DETAULT_ACTION_PAYLOAD = {
  keywords: '',
  status: SALARY_EMPLOYEE_STATUS.ALL,
  include: true,
  pageNo: 1,
  pageSize: 20,
};

export default class List extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      actionPayload: {...DETAULT_ACTION_PAYLOAD},
    }
  };

  onChangePageConfig = (newPageNo, newPageSize) => {
    const { actionPayload } = this.state;
    const { pageNo, pageSize } = actionPayload;
    this.setState({
      actionPayload: this.getChangedActionPayload({
        pageNo: newPageNo || pageNo,
        pageSize: newPageSize || pageSize,
      }),
    });
  };

  onChangeKeywords = keywords => {
    this.setState({
      actionPayload: this.getChangedActionPayload({
        keywords,
      }),
    });
  };

  onSwitchTab = tabKey => {
    this.setState({
      actionPayload: this.getChangedActionPayload({
        status: tabKey,
      }),
    });
  };

  getChangedActionPayload = (newPayload, oldPayload = this.state.actionPayload) => {
    let payload = {...oldPayload};
    if( Object.keys(newPayload).some( key => key !== 'pageNo' && newPayload[key] !== oldPayload[key] ) ) {
      payload = { ...DETAULT_ACTION_PAYLOAD }
    }
    Object.keys(newPayload).forEach( key => {
      payload[key] = newPayload[key];
    } );
    return payload;
  };

  headerActions = [{
    action: items => {
      window.console.log(items);
    },
    icon: 'icon-disable',
    label: '批量本月不计薪',
  }];

  itemActions = [{
    action: ({ id }) => window.console.log(id),
    label: '查看',
  }, {
    action: ({ id }) => window.console.log([id]),
    label: '本月不计薪',
  } ];

  openUnpaidEmployee = () => {
    const { history } = this.props;
    history.push('/unpaid_salary_list');
  };

  openImportModel = () => {
  };


  openEmployee = (item) => {
    this.setState({
      openId: item.id,
    });
  };

  closeEmployee = () => {
    this.setState({
      openId: undefined,
    });
  };

  jumpToReport = () => {
    const { history } = this.props;
    history.push('/salary_report');
  };

  render() {
    const { actionPayload, openId } = this.state;
    return (
      <div className={styles.salaryList} style={{backgroundColor: '#fff'}}>
        <Header
          tabKey={actionPayload.status}
          onSwitchTab={this.onSwitchTab}
          onChangeKeywords={this.onChangeKeywords}
          openUnpaidEmployee={this.openUnpaidEmployee}
          openImportModel={this.openImportModel}
          jumpToReport={this.jumpToReport}
        />
        <div className={styles.salaryListContent} style={{backgroundColor: '#f9f9f9'}}>
          <Table
            actionPayload={actionPayload}
            columns={ actionPayload.status === SALARY_EMPLOYEE_STATUS.FORMER ? ALL_COLUMNS : WITHOUT_FORMER_COLUMNS }
            headerActions={this.headerActions}
            itemActions={this.itemActions}
            onChangePageConfig={this.onChangePageConfig}
            onRowClick={this.openEmployee}
          />
        </div>
        <DetailDialog open={!!openId} hasSwitch onClose={this.closeEmployee}>
          <Detail id={openId} />
        </DetailDialog>
      </div>
    );
  }
}
