import { SOCIAL_SECURITY_PLAN_CONFIG, HOUSING_FUND_PLAN_CONFIG } from 'constants/salary'
import { createModels } from 'utils/modelUtil';
import {
  getSocialSecurityPlans,
  getHousingFundPlans,
  saveSocialSecurityScheme,
  deleteSocialSecurityPlan,
  deleteHousingFundPlan,
  saveProvidentFundScheme,
} from '../services/settingInsuranceSetting';

import { Actions, createActions } from '../utils/actionUtil';

const NAMESPACE = 'settingInsuranceSetting';

const ACTION_NAMES = new Actions({
  GET_SOCIAL_SECURITY_PLANS: null,
  GET_HOUSING_FUND_PLANS: null,
  SAVE_SOCIAL_SECURITY_PLANS: null,
  SAVE_HOUSING_FUND_PLANS: null,
  UPDATE_SOCIAL_SECURITY_SCHEME: null,
  UPDATE_HOUSING_FUND_PLANS: null,
  HOUSING_FUND_FIELD_CHANGE: null,
  SOCIAL_SECURITY_FIELD_CHANGE: null,
  UPDATE_FORM_ERROR: null,
  CLEAR_FORM_ERROR: null,
  DELETE_SOCIAL_SECURITY_PLAN: null,
  DELETE_HOUSING_FUND_PLAN: null,
});

const { effects, reducers } = createModels({

  // 获取薪资项列表
  [ACTION_NAMES.SAVE_HOUSING_FUND_PLANS]: {
    servers: saveProvidentFundScheme,
  },

  // 获取薪资项列表
  [ACTION_NAMES.SAVE_SOCIAL_SECURITY_PLANS]: {
    servers: saveSocialSecurityScheme,
  },

  [ACTION_NAMES.DELETE_HOUSING_FUND_PLAN]: {
    servers: deleteHousingFundPlan,
  },

  [ACTION_NAMES.DELETE_SOCIAL_SECURITY_PLAN]: {
    servers: deleteSocialSecurityPlan,
  },
});

const DEFAULT_STATE = {
  socialSecurityScheme: {...SOCIAL_SECURITY_PLAN_CONFIG},
  socialSecuritySchemeList: {},
  providentFundScheme: {...HOUSING_FUND_PLAN_CONFIG},
  providentFundSchemeList: {},
}

export const actions = createActions(ACTION_NAMES, NAMESPACE);

export default {
  namespace: NAMESPACE,

  state: DEFAULT_STATE,

  effects: {
    ...effects,
    ...reducers,

    // 获取社保方案列表
    *[ACTION_NAMES.GET_SOCIAL_SECURITY_PLANS]({ payload }, {call, put}){
      const response = yield call(getSocialSecurityPlans, payload);
      yield put({
        type: 'socialSecurityPlans',
        payload: response,
      })
    },

    // 获取公积金方案列表
    *[ACTION_NAMES.GET_HOUSING_FUND_PLANS]({ payload }, {call, put}){
      const response = yield call(getHousingFundPlans, payload);
      yield put({
        type: 'housingFundPlans',
        payload: response,
      })
    },

    // 更新社保表单各项的值
    *[ACTION_NAMES.SOCIAL_SECURITY_FIELD_CHANGE]({ payload }, { put }) {
      yield put({
        type: 'socialFieldChange',
        payload,
      });
    },

    // 更新公积金表单各项的值
    *[ACTION_NAMES.HOUSING_FUND_FIELD_CHANGE]({ payload }, { put }) {
      yield put({
        type: 'housingFieldChange',
        payload,
      });
    },

    // 更新社保方案的各项的值
    *[ACTION_NAMES.UPDATE_SOCIAL_SECURITY_SCHEME]({ payload }, { put }) {
      yield put({
        type: 'updateSocialSecurityScheme',
        payload,
      });
    },

    // 更新公积金方案的各项的值
    *[ACTION_NAMES.UPDATE_HOUSING_FUND_PLANS]({ payload }, { put }) {
      yield put({
        type: 'updateHousingFundPlans',
        payload,
      });
    },
  },

  reducers: {
    socialFieldChange(state, { payload }) {
      const newScheme = Object.assign({}, ...payload)
      return {
        ...state,
        socialSecurityScheme: newScheme,
      };
    },

    housingFieldChange(state, { payload }) {
      const newScheme = Object.assign({}, ...payload)
      return {
        ...state,
        providentFundScheme: newScheme,
      };
    },

    socialSecurityPlans(state, { payload }){
      return {
        ...state,
        socialSecuritySchemeList: payload,
      }
    },

    housingFundPlans(state, { payload }){
      return {
        ...state,
        providentFundSchemeList: payload,
      }
    },

    updateSocialSecurityScheme(state, { payload }){
      return {
        ...state,
        socialSecurityScheme: {...payload},
      }
    },

    updateHousingFundPlans(state, { payload }){
      return {
        ...state,
        providentFundScheme: {...payload},
      }
    },
  },
}
