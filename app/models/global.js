import { Actions, createActions } from 'utils/actionUtil';
import { createModels } from 'utils/modelUtil'; // merge2State
import GlobalService from 'services/global';
import * as Immutable from 'immutable';
import menus from '../common/menus';

const globalService = new GlobalService();

const NAMESPACE = 'global';

export const ACTION_NAMES = new Actions({
  FETCH_USER: null, // 获取用户信息
  FETCH_MENUS: null,
  FETCH_USER_PERMISSION: null, // 获取角色权限
  UPDATE_USER: null, // 更新用户信息
  UPDATE_USER_PERMISSION: null, // 更新角色权限
  CLEAR_ALL_PERMISSION: null,
});

function getAuthByCode(_permissions, code) {
  const permissions = _permissions.get('permission');
  if (code && permissions) {
    const index = permissions.get('backend').findIndex(permission => {
      if (permission && permission.size > 0) {
        return permission.get('code') === code;
      } else {
        return false;
      }
    });
    return index > -1;
  } else {
    return false;
  }
}

function filterMenuByUser(fullMenus, permission) {
  if (permission.get('superAdmin')) { // 超级管理员
    return fullMenus;
  } else {
    const commonMenus = Immutable.fromJS(fullMenus).filterNot(menu => menu.key === 'setting' || menu.key === 'role');
    const getMenu = (data, permissions) => {
      return data.map(menu => {
        const code = menu && menu.get('code') ? menu.get('code') : null;
        if (getAuthByCode(permissions, code)) {
          if (code === 'organizationManage') {
            const newMenuChildren = menu.get('children').filter(item => getAuthByCode(permissions, item.get('code')));
            const newMenu = menu.set('children', newMenuChildren);
            return newMenu;
          } else {
            return menu;
          }
        } else {
          return null;
        }
      }).filter(item => item && item.size > 0);
    };
    const filteredMenu = getMenu(commonMenus, permission).toJS();
    return filteredMenu;
  }
}

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取角色信息
  [ACTION_NAMES.FETCH_USER]: {
    servers: globalService.queryUser.bind(globalService),
  },
  // 获取角色权限配置
  [ACTION_NAMES.FETCH_USER_PERMISSION]: {
    servers: globalService.queryUserPermission.bind(globalService),
  },
});

export default {
  namespace: NAMESPACE,

  state: {
    menus: [],
    user: {},
    permission: {},
  },

  effects: {
    ...effects,
    *[ACTION_NAMES.UPDATE_USER]({ payload }, { put }) {
      yield put({
        type: 'updateUser',
        payload,
      });
    },
    *[ACTION_NAMES.UPDATE_USER_PERMISSION]({ payload }, { put }) {
      yield put({
        type: 'updateUserPermission',
        payload,
      });
    },
    *[ACTION_NAMES.FETCH_MENUS](_undefined, { put }) {
      yield put({
        type: 'updateMenus',
        payload: {},
      });
    },
    *[ACTION_NAMES.CLEAR_ALL_PERMISSION](_undefined, { put }) {
      yield put({
        type: 'clearAllPermission',
        payload: {},
      });
    },
  },

  reducers: {
    ...reducers,
    updateUser(state, { payload }) {
      return {
        ...state,
        user: Immutable.fromJS(payload),
      }
    },
    updateUserPermission(state, { payload }) {
      return {
        ...state,
        permission: Immutable.fromJS(payload),
      }
    },
    updateMenus(state, { payload }) {
      const { permission } = state;
      const fullMenus = menus.menuData;
      return {
        ...state,
        menuAuth: payload,
        menus: filterMenuByUser(fullMenus, permission),
      };
    },
    clearAllPermission(state) {
      return {
        ...state,
        menus: [],
        user: {},
        permission: {},
      };
    },
  },
};
