import React, { PureComponent } from 'react';

import { SALARY_REPORT_TABS } from 'constants/salary';

import { Button, Input } from 'components/Base';

import Tabs from 'components/Tabs';

import styles from './Report.less';

export default class Header extends PureComponent {
  
  render() {
    const { tabKey, onSwitchTab, onChangeKeywords, openCancel, onArchive, openConfirm, flag} = this.props;
    return (
<div>
      <header className={styles.header}>
        <span className={styles.title}>
          {(flag ==='archive')?<span className={styles.titlePrefix}>报表</span>:<span className={styles.titlePrefix}>本月报表</span>}
          <span className={styles.titleTime}>2018.05.01-2018.06.01</span>
        </span>
        <Input.Search onChange={onChangeKeywords} className={styles.keyword} placeholder="搜索"/>
        <div className={styles.actions}>
          {(flag === null)?<Button onClick={ openConfirm }>核算确认</Button>

          :((flag==='confirm')?((<div><Button onClick={ openCancel }>取消核算确认</Button> <Button onClick={ onArchive } type="primary">归档5月工资报表</Button></div>))  

          :null) }
        </div>
      </header>
      <Tabs className={styles.tabs} value={tabKey} tabs={SALARY_REPORT_TABS} onChange={onSwitchTab}/>
    </div>
);
  }
}
