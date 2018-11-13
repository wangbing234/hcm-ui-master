import React from 'react';

import { SALARY_LIST_TABS } from 'constants/salary';

import { getFirstLetterImg } from 'utils/pinyinUtil';

import withFetch from 'decorators/withFetch';
import HCMTable from 'components/HCMTable';

import { actions } from 'models/salary';

import styles from './List.less';

const {
  GET_SALARY_LIST,
} = actions;

export default withFetch(GET_SALARY_LIST, state => ({
  data: state.salary.salaryList,
}))(HCMTable);

const SALARY_EMPLOYEE_STATUS_MAP = {};
SALARY_LIST_TABS.forEach( ({key, title}) => {
  SALARY_EMPLOYEE_STATUS_MAP[key] = title
} );

export const ALL_COLUMNS = [
  {
    title: '姓名',
    dataIndex: 'name',
    render: (text, record) => (
      <div>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <span>
              <img src={record.avatar || getFirstLetterImg(text)} alt="头像" />
            </span>
          </div>
        </div>
        <span className={styles.text}>{text}</span>
      </div>
    ),
  },
  {
    title: '公司',
    dataIndex: 'companyName',
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
  },
  {
    title: '工号',
    dataIndex: 'employeeNo',
  },
  {
    title: '员工状态',
    dataIndex: 'status',
    render: status => SALARY_EMPLOYEE_STATUS_MAP[status] || '-',
  },
  {
    title: '入职时间',
    dataIndex: 'hireDate',
  },
  {
    title: '离职时间',
    dataIndex: 'resignationDate',
  },
  {
    title: '基本工资',
    dataIndex: 'salary',
  },
];

export const WITHOUT_FORMER_COLUMNS = ALL_COLUMNS.filter( ({dataIndex}) => dataIndex !== 'resignationDate' );
