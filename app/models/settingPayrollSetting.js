import { merge2State, createModels } from 'utils/modelUtil';
import { getSalaryConfig, payDateSetting, cycleDateSetting } from '../services/settingPayrollSetting';

import { Actions, createActions } from '../utils/actionUtil';

const NAMESPACE = 'settingPayrollSetting';

const ACTION_NAMES = new Actions({
  GET_SALARIES_CONFIG: null,
  CYCLE_DATE_SETTING: null,
  PAY_DATE_SETTING: null,
});

const { effects, reducers } = createModels({

  // 设置薪酬周期
  [ACTION_NAMES.CYCLE_DATE_SETTING]: {
    servers: cycleDateSetting,
  },

  // 设置发薪日期
  [ACTION_NAMES.PAY_DATE_SETTING]: {
    servers: payDateSetting,
    reducerName: 'payDate',
    reducer: merge2State('payDate'),
  },
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

export default {
  namespace: NAMESPACE,

  state: {
    firstCycleMonth: null,
    salaryPayDate: null,
    salaryPayMonth: null,
    startCycleDay: null,
  },

  effects: {

    ...effects,

    // 获取薪酬配置信息
    *[ACTION_NAMES.GET_SALARIES_CONFIG]({ payload }, { call, put }) {
      const response = yield call(getSalaryConfig, payload);
      yield put({
        type: 'cycleDate',
        payload: response,
      });
    },
  },

  reducers: {

    ...reducers,

    // 设置薪酬周期
    cycleDate(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
