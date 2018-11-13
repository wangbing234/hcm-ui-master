import React, { PureComponent } from 'react';

import { SALARY_LIST_TABS } from 'constants/salary';

import { Button, Input } from 'components/Base';

import Tabs from 'components/Tabs';

import styles from './List.less';

export default class Header extends PureComponent {

  render() {
    const { tabKey, keyword, onSwitchTab, onChangeKeywords, openUnpaidEmployee, openImportModel, jumpToReport } = this.props;
    return (
<div>
      <header className={styles.header}>
        <span className={styles.title}>
          <span className={styles.titlePrefix}>本月</span>
          <span className={styles.titleTime}>2018.05.01-2018</span>
        </span>
        <Input.Search value={keyword} onChange={onChangeKeywords} className={styles.keyword} placeholder="搜索"/>
        <div className={styles.actions}>
          <Button onClick={ openUnpaidEmployee }>本月不计薪人员表</Button>
          <Button onClick={ openImportModel } type="primary-light">导入本月明细</Button>
          <Button onClick={ jumpToReport } type="primary">本月报表</Button>
        </div>
      </header>
      <Tabs value={tabKey} tabs={SALARY_LIST_TABS} onChange={onSwitchTab}/>
    </div>
);
  }
}
