import { Actions, createActions } from 'utils/actionUtil';
import { DEFAULT_FORM_ORDER, DEFAULT_FIELD_CONFIG } from 'constants/department';
import { effectErrorForm } from 'utils/createError';
import { merge2State, createModels } from 'utils/modelUtil';

import DeptService from '../services/department';

const NAMESPACE = 'department';

const deptService = new DeptService();

export const ACTION_NAMES = new Actions({
  GET_DEPARTMENTS: null,
  GET_DEPARTMENT: null,
  SAVE_DEPARTMENT: null,
  // CREATE_DEPARTMENT: null,
  DELETE_DEPARTMENT: null,
  INVALID_DEPARTMENT: null,
  GET_COMPANY_TREE: null,
  GET_ORG_CUS_FIELDS: null,

  UPDATE_DEPARTMENT_INFO: null, // 更新单击行时的部门信息
  UPDATE_CONFIRM_INFO: null, // 更新table单行hover操作
  UPDATE_COMPANY_TREE: null, // 更新公司组织架构

  UPDATE_ERROR: null, // 更新弹窗错误信息
});

const defaultFormField = DEFAULT_FORM_ORDER.map(code => ({
  ...DEFAULT_FIELD_CONFIG[code],
  code,
}));

const DEFAULT_STATE = {
  formField: defaultFormField,
};

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取部门列表
  [ACTION_NAMES.GET_DEPARTMENTS]: {
    servers: [deptService, deptService.getDepartments],
    reducerName: 'departmentList',
    reducer: merge2State('departmentList'),
  },

  // 获取公司信息
  [ACTION_NAMES.GET_DEPARTMENT]: {
    servers: deptService.getDepartment.bind(deptService),
    reducerName: ACTION_NAMES.UPDATE_DEPARTMENT_INFO,
    use: [coverDepartmentData],
    reducer: merge2State('departmentInfo'),
  },

  [ACTION_NAMES.SAVE_DEPARTMENT]: {
    servers: deptService.saveDepartment.bind(deptService),
  },

  // 获取只包含公司tree
  [ACTION_NAMES.GET_COMPANY_TREE]: {
    servers: deptService.getCompanyTree.bind(deptService),
    use: [coverCompanyTree],
    reducer: merge2State('companyTree'),
  },

  // 删除部门
  [ACTION_NAMES.DELETE_DEPARTMENT]: {
    servers: deptService.deleteDepartment.bind(deptService),
  },

  // 失效部门
  [ACTION_NAMES.INVALID_DEPARTMENT]: {
    servers: deptService.invalidDepartment.bind(deptService),
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
        formField: composeCustomFieldToFormField(defaultFormField, payload),
      };
    },
  },
};

function coverCompanyTree({ id, name, children, type, enabled }) {
  return {
    type,
    title: name,
    value: `${type}-${id}-${name}`,
    key: `${type}-${id}-${name}`,
    disabled: !enabled,
    children: children && children.map(coverCompanyTree),
  };
}

// 获取部门数据添加 parentId 字段，匹配所属公司或部门
function coverDepartmentData({
  parentCompanyId,
  parentDepartmentId,
  parentCompanyName,
  parentDepartmentName,
  ...rest
}) {
  const parentId = parentCompanyId || parentDepartmentId;
  const name = parentCompanyName || parentDepartmentName;
  const type = parentCompanyId ? 'company' : 'department';
  return {
    parentId: `${type}-${parentId}-${name}`,
    ...rest,
  };
}

function composeCustomFieldToFormField(defaultForm, customField) {
  return defaultForm.concat(
    customField
      .filter(({ active, targetType }) => active && targetType === 'department')
      .sort((field1, field2) => field1.position - field2.field2)
  );
}
