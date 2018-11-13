import React, { PureComponent } from 'react';

import { SALARY_EMPLOYEE_STATUS } from 'constants/salary';

import { Input } from 'components/Base';
import Table, { ALL_COLUMNS  } from './Table';

import styles from './List.less';

const DETAULT_ACTION_PAYLOAD = {
  keywords: '',
  status: SALARY_EMPLOYEE_STATUS.ALL,
  include: false,
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

  openEmployee = (item) => {
    window.console.log(item);
  };

  render() {
    const { actionPayload } = this.state;
    return (
      <div className={styles.salaryList}>
        <header className={styles.header}>
          <span className={styles.title}>
            <span className={styles.titlePrefix}>本月不计薪人员表</span>
            <span className={styles.titleTime}>2018.05.01-2018.05.31</span>
          </span>
          <div className={styles.actions}>
            <Input.Search value={actionPayload.keywords} onChange={this.onChangeKeywords} className={styles.keyword} placeholder="搜索"/>
          </div>
        </header>
        <div className={styles.salaryListContent}>
          <Table
            actionPayload={actionPayload}
            columns={ALL_COLUMNS}
            headerActions={this.headerActions}
            itemActions={this.itemActions}
            onChangePageConfig={this.onChangePageConfig}
            onRowClick={this.openEmployee}
          />
        </div>
      </div>
    );
  }
}
