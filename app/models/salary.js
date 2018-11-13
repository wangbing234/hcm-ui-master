import { Actions, createActions } from 'utils/actionUtil';
// import { DEFAULT_FORM_ORDER, DEFAULT_FIELD_CONFIG } from 'constants/salary';
import { merge2State, createModels } from 'utils/modelUtil';

import {
  getSalaryList,
  getDetailBasic,
  getDetailMonthly,
  getDetailSalary,
  getDetailSecurity,
  getDetailHistory,
} from '../services/salary.js';

const NAMESPACE = 'salary';

export const ACTION_NAMES = new Actions({
  GET_SALARY_LIST: null,
  GET_DETAIL_BASIC: null,
  GET_DETAIL_MONTHLY: null,
  GET_DETAIL_SALARY: null,
  GET_DETAIL_SECURITY: null,
  GET_DETAIL_HISTORY: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取薪资列表
  [ACTION_NAMES.GET_SALARY_LIST]: {
    servers: getSalaryList,
    reducer: merge2State('salaryList'),
  },

  // 获取员工基本信息
  [ACTION_NAMES.GET_DETAIL_BASIC]: {
    servers: getDetailBasic,
    reducer: merge2State('detailBasic'),
  },

  // 获取员工本月明细
  [ACTION_NAMES.GET_DETAIL_MONTHLY]: {
    servers: getDetailMonthly,
    reducer: merge2State('detailMonthly'),
  },

  // 获取员工薪酬信息
  [ACTION_NAMES.GET_DETAIL_SALARY]: {
    servers: getDetailSalary,
    reducer: merge2State('detailSalary'),
  },

  // 获取员工五险一金
  [ACTION_NAMES.GET_DETAIL_SECURITY]: {
    servers: getDetailSecurity,
    reducer: merge2State('detailSecurity'),
  },

  // 获取员工调薪历史
  [ACTION_NAMES.GET_DETAIL_HISTORY]: {
    servers: getDetailHistory,
    reducer: merge2State('detailHistory'),
  },
});

const DEFAULT_STATE = {
  // list: {}
}

export default {
  namespace: NAMESPACE,

  state: DEFAULT_STATE,

  effects: {
    ...effects,
  },

  reducers: {
    ...reducers,
  },
};
