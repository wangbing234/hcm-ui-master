import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { RoleService } from '../services/role';

const roleService = new RoleService();
const { getRolesEmployees, getRolesEmployee, editRolesEmployee, querySuperAdmin } = roleService;

const NAMESPACE = 'roleAssignment';

const ACTION_NAMES = new Actions({
  GET_ROLE_EMPLOYEES: null,
  GET_ROLE_EMPLOYEE: null,
  EDIT_EMPLOYEE: null,
  GET_SUPERADMIN_INFO: null,
  UPDATE_EMPLOYEE_INFO: null,
  CLEAR_EMPLOYEE:null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取员工列表
  [ACTION_NAMES.GET_ROLE_EMPLOYEES]: {
    servers: getRolesEmployees.bind(roleService),
    reducerName: 'rolesEmployees',
    reducer: merge2State('rolesEmployees'),
  },
    // 获取超级管理员信息
    [ACTION_NAMES.GET_SUPERADMIN_INFO]: {
      servers: querySuperAdmin.bind(roleService),
      reducerName: 'querySuperAdmin',
      reducer: merge2State('querySuperAdmin'),
    },

  // 获取员工单条列表
  [ACTION_NAMES.GET_ROLE_EMPLOYEE]: {
    servers: getRolesEmployee.bind(roleService),
    reducerName: ACTION_NAMES.UPDATE_EMPLOYEE_INFO,
    reducer: merge2State('rolesEmployee'),
  },
  // 编辑角色分配
  [ACTION_NAMES.EDIT_EMPLOYEE]: {
    servers: editRolesEmployee.bind(roleService),
  },
});
export default {
  namespace: NAMESPACE,

  state: {
    rolesEmployees: null,
    rolesEmployee: null,
  },

  effects: {
    ...effects,
    *[ACTION_NAMES.CLEAR_EMPLOYEE](_undefined, { put }) {
      yield put({
        type: 'clearEmployee',
      });
    },
  },
  reducers: {
    ...reducers,
    clearEmployee(state,){
      return {
        ...state,
        rolesEmployee: null,
      }

    },
  },
};
