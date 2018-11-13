import * as Immutable from 'immutable';
import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { OrganizationSettingService } from '../services/setting';

const organizationSettingService = new OrganizationSettingService();
const {
  getCusFields,
  createCusField,
  editCusField,
  toggleActiveCusField,
} = organizationSettingService;

const NAMESPACE = 'setting';

const ACTION_NAMES = new Actions({
  GET_ORG_CUS_FIELD_LIST: null,
  CREATE_ORG_CUS_FIELD: null,
  EDIT_ORG_CUS_FIELD: null,
  ACTIVE_ORG_CUS_FIELD: null,
  TOGGLE_ACTIVE_ORG_CUS_FIELD: null,

  CHANGE_ORG_CUS_FIELD: null,
  ON_EDIT_ORG_CUS_FIELD: null,
  ON_CREATE_ORG_CUS_FIELD: null,
  ADD_OPTION_ORG_CUS_FIELD: null,
  DELETE_OPTION_ORG_CUS_FIELD: null,
  UPDATE_ORG_CUS_FIELD_ERROR: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 组织管理-获取自定义字段列表
  [ACTION_NAMES.GET_ORG_CUS_FIELD_LIST]: {
    servers: getCusFields.bind(organizationSettingService),
    use: [dispatchOtherorgCusFields],
    reducerName: 'orgCusFields',
    reducer: merge2State('orgCusFields'),
  },
  // 组织管理-保存-新增自定义字段
  [ACTION_NAMES.CREATE_ORG_CUS_FIELD]: {
    servers: createCusField.bind(organizationSettingService),
    use: [getRefreshList],
  },
  // 组织管理-保存-编辑自定义字段
  [ACTION_NAMES.EDIT_ORG_CUS_FIELD]: {
    servers: editCusField.bind(organizationSettingService),
    use: [getRefreshList],
  },
  // 组织管理-启用/禁用自定义字段
  [ACTION_NAMES.TOGGLE_ACTIVE_ORG_CUS_FIELD]: {
    servers: toggleActiveCusField.bind(organizationSettingService),
    use: [updateCusFieldsList],
  },
});

const initOrgCusField = Immutable.fromJS({
  options: [''],
});

const initOrgCusFieldErrors = Immutable.fromJS({});

export default {
  namespace: NAMESPACE,

  state: {
    orgCusFields: [],
    orgCusField: initOrgCusField,
    orgCusFieldErrors: initOrgCusFieldErrors,
  },

  effects: {
    ...effects,
    *[ACTION_NAMES.CHANGE_ORG_CUS_FIELD]({ payload }, { put }) {
      yield put({
        type: 'changeOrgCusField',
        payload,
      });
    },
    *[ACTION_NAMES.ON_EDIT_ORG_CUS_FIELD]({ payload }, { put }) {
      yield put({
        type: 'editOrgCusField',
        payload,
      });
    },
    *[ACTION_NAMES.ON_CREATE_ORG_CUS_FIELD]({ payload }, { put }) {
      yield put({
        type: 'createOrgCusField',
        payload,
      });
    },
    *[ACTION_NAMES.ADD_OPTION_ORG_CUS_FIELD]({ payload }, { put }) {
      yield put({
        type: 'addOptionOrgCusField',
        payload,
      });
    },
    *[ACTION_NAMES.DELETE_OPTION_ORG_CUS_FIELD]({ payload }, { put }) {
      yield put({
        type: 'deleteOptionOrgCusField',
        payload,
      });
    },
    *[ACTION_NAMES.UPDATE_ORG_CUS_FIELD_ERROR]({ payload }, { put }) {
      yield put({
        type: 'updateOrgCusFieldError',
        payload,
      });
    },
  },

  reducers: {
    ...reducers,
    // 更新列表(组织管理-自定义字段)
    updateOrgCusFields(state, { payload }) {
      const newList = state.orgCusFields.map(item => {
        const field = item;
        if (field.id === payload) {
          field.active = !field.active;
          return field;
        }
        return item;
      });
      return {
        ...state,
        orgCusFields: newList,
      };
    },
    // 新增、编辑自定义字段表单onChange
    changeOrgCusField(state, { payload }) {
      let newData;
      const { orgCusField } = state;
      const { type, value, index } = payload;
      if (type === 'options') {
        newData = orgCusField.setIn(['options', index], value);
      } else {
        newData = orgCusField.set(type, value);
      }
      return {
        ...state,
        orgCusField: newData,
      };
    },
    // 编辑自定义字段
    editOrgCusField(state, { payload }) {
      return {
        ...state,
        orgCusField: payload,
        orgCusFieldErrors: initOrgCusFieldErrors,
      };
    },
    // 新增自定义字段
    createOrgCusField(state) {
      return {
        ...state,
        orgCusField: initOrgCusField,
        orgCusFieldErrors: initOrgCusFieldErrors,
      };
    },
    // 增加单选选项
    addOptionOrgCusField(state) {
      const { orgCusField } = state;
      const newOptions = orgCusField.get('options').push('');
      const newData = orgCusField.set('options', newOptions);
      return {
        ...state,
        orgCusField: newData,
      };
    },
    // 删除单选选项
    deleteOptionOrgCusField(state, { payload }) {
      const { orgCusField } = state;
      const newOptions = orgCusField.get('options').delete(payload);
      const newData = orgCusField.set('options', newOptions);
      return {
        ...state,
        orgCusField: newData,
      };
    },
    // 保存校验表单
    updateOrgCusFieldError(state, { payload }) {
      return {
        ...state,
        orgCusFieldErrors: payload,
      };
    },
  },
};

function* getRefreshList(res, action, { put, call }) {
  yield put({
    type: 'orgCusFields',
    payload: yield call(getCusFields.bind(organizationSettingService)),
  });
  return res;
}

function* updateCusFieldsList(res, action, { put }) {
  yield put({
    type: 'updateOrgCusFields',
    payload: action.payload,
  });
  return res;
}

function* dispatchOtherorgCusFields(res, action, { put }) {
  yield put({
    type: 'company/updateOrgCusFields',
    payload: res,
  });
  yield put({
    type: 'department/updateOrgCusFields',
    payload: res,
  });
  yield put({
    type: 'position/updateOrgCusFields',
    payload: res,
  });
  yield put({
    type: 'grade/updateOrgCusFields',
    payload: res,
  });
  return res;
}
