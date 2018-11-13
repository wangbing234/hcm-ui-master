import React, { PureComponent } from 'react';

import { EMPLOYEE_STATUS_MAP, EMPLOYEE_TYPE_MAP } from 'constants/employee';
import { SALARY_DETAIL_TABS } from 'constants/salary';

import withFetch from 'decorators/withFetch';

import { actions } from 'models/salary';

import Avatar from 'routes/Employee/Detail/Avatar';
import Tabs from 'components/Tabs';

import styles from './Detail.less';

const {
  GET_DETAIL_BASIC,
} = actions;

@withFetch(GET_DETAIL_BASIC, ({salary}) => ({
  data: salary.detailBasic,
}))
export default class Header extends PureComponent {

  render() {
    const { tabKey, onSwitchTab, data } = this.props;
    if( !data ) {
      return null;
    }
    const {
      avatar,
      name,
      company, department, position, grade, status, type,
      mobile,
      employeeNo, hireDate,
    } = data;
    return [
      <header className={styles.header}>
        <Avatar isView value={avatar} className={styles.avatarWrapper}/>
        <div className={styles.headerContent}>
          <span className={styles.headerInfo1}>{name}</span>
          <span className={styles.headerInfo2}>{[
            company,
            department,
            position,
            grade,
            EMPLOYEE_STATUS_MAP[status],
            EMPLOYEE_TYPE_MAP[type],
          ].join('  |  ')}</span>
          <span className={`icon-call ${styles.headerInfo3 }`}>{mobile}</span>
          <span className={styles.headerInfo4}>
            <span>{`工号: ${employeeNo}`}</span>
            <span>{`入职日期: ${hireDate}`}</span>
          </span>
        </div>
      </header>,
      <Tabs value={tabKey} tabs={SALARY_DETAIL_TABS} onChange={onSwitchTab}/>,
    ];
  }

}
