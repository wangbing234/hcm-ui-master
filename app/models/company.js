import { Actions, createActions } from 'utils/actionUtil';
import { DEFAULT_FORM_ORDER, DEFAULT_FIELD_CONFIG } from 'constants/company';
import { effectErrorForm } from 'utils/createError';
import { merge2State, createModels } from 'utils/modelUtil';
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  inactiveCompany,
  getCompanyTree,
} from '../services/company.js';

const NAMESPACE = 'company';

export const ACTION_NAMES = new Actions({
  GET_COMPANIES: null,
  GET_COMPANY: null,
  CREATE_COMPANY: null,
  UPDATE_COMPANY: null,
  DELETE_COMPANY: null,
  INACTIVE_COMPANY: null,
  GET_COMPANY_TREE: null,

  UPDATE_COMPANY_INFO: null,
  UPDATE_CONFIRM_INFO: null,
  UPDATE_COMPANY_TREE: null,

  UPDATE_ERROR: null,
});

const defaultFormField = DEFAULT_FORM_ORDER.map(code => ({
  ...DEFAULT_FIELD_CONFIG[code],
  code,
}));

const DEFAULT_STATE = {
  formField: defaultFormField,
};

const COMPANY_LIST_REDUCER_NAME = 'companyList';

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取公司列表
  [ACTION_NAMES.GET_COMPANIES]: {
    servers: getCompanies,
    reducerName: COMPANY_LIST_REDUCER_NAME,
    use: [
      function* emptyCompanyInfo(res, action, { put }) {
        yield put({
          type: ACTION_NAMES.UPDATE_COMPANY_INFO,
        });
        return res;
      },
    ],
    reducer: merge2State('companyList'),
  },

  // 获取公司信息
  [ACTION_NAMES.GET_COMPANY]: {
    servers: getCompany,
    reducerName: ACTION_NAMES.UPDATE_COMPANY_INFO,
    reducer: merge2State('companyInfo'),
  },

  // 获取只包含公司tree
  [ACTION_NAMES.GET_COMPANY_TREE]: {
    servers: getCompanyTree,
    use: [coverCompanyTree],
    reducer: merge2State('companyTree'),
  },

  // 创建公司
  [ACTION_NAMES.CREATE_COMPANY]: {
    servers: createCompany,
  },

  // 编辑公司
  [ACTION_NAMES.UPDATE_COMPANY]: {
    servers: updateCompany,
  },

  // // 删除公司
  [ACTION_NAMES.DELETE_COMPANY]: {
    servers: deleteCompany,
  },

  // // 失效公司
  [ACTION_NAMES.INACTIVE_COMPANY]: {
    servers: inactiveCompany,
  },
});

export default {
  namespace: NAMESPACE,

  state: DEFAULT_STATE,

  effects: {
    ...effects,
    ...effectErrorForm(ACTION_NAMES.UPDATE_ERROR, NAMESPACE),
  },

  reducers: {
    ...reducers,

    [ACTION_NAMES.UPDATE_CONFIRM_INFO]: merge2State('confirmInfo'),
    [ACTION_NAMES.UPDATE_COMPANY_TREE]: merge2State('companyTree'),

    updateOrgCusFields(state, { payload }) {
      return {
        ...state,
        formField: composeCustomFieldToFormField(payload),
      };
    },
  },
};
function coverCompanyTree({ id, name, children, enabled }) {
  return {
    type: 'company',
    title: name,
    value: `${id}`,
    key: `${id}`,
    disabled: !enabled,
    children: children && children.map(coverCompanyTree),
  };
}

export function composeCustomFieldToFormField(customField = []) {
  return defaultFormField.concat(
    customField
      .filter(({ active, targetType }) => active && targetType === 'company')
      .sort((field1, field2) => field1.position - field2.position)
  );
}
