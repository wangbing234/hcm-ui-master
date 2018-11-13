import { Actions, createActions } from 'utils/actionUtil';
import { DEFAULT_FORM_ORDER, DEFAULT_FIELD_CONFIG } from 'constants/position';
import { /* show,  */ registerService } from 'utils/createError';
import { merge2State, createModels } from 'utils/modelUtil';
import {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
  inactivePosition,
  getPositionTree,
} from '../services/position.js';
import { getGrades } from '../services/grade.js';

const NAMESPACE = 'position';

export const ACTION_NAMES = new Actions({
  GET_POSITIONS: null,
  GET_POSITION: null,
  SAVE_POSITION: null,
  GET_GRADES: null,
  DELETE_POSITION: null,
  INACTIVE_POSITION: null,
  GET_POSITION_TREE: null,

  UPDATE_POSITION_INFO: null,
  UPDATE_CONFIRM_INFO: null,
  UPDATE_POSITION_TREE: null,

  UPDATE_ERROR: null,
});

const defaultFormField = DEFAULT_FORM_ORDER.map(code => ({
  ...DEFAULT_FIELD_CONFIG[code],
  code,
}));

const DEFAULT_STATE = {
  formField: defaultFormField,
};

const POSITION_LIST_REDUCER_NAME = 'positionList';

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取岗位列表
  [ACTION_NAMES.GET_POSITIONS]: {
    servers: getPositions,
    reducerName: POSITION_LIST_REDUCER_NAME,
    reducer: merge2State('positionList'),
  },

  // 获取岗位信息
  [ACTION_NAMES.GET_POSITION]: {
    servers: getPosition,
    reducerName: ACTION_NAMES.UPDATE_POSITION_INFO,
    reducer: merge2State('positionInfo'),
  },

  // 获取只包含上级部门tree
  [ACTION_NAMES.GET_POSITION_TREE]: {
    servers: getPositionTree,
    use: [coverPositionTree],
    reducer: merge2State('positionTree'),
  },
  // 获取职级名列表
  [ACTION_NAMES.GET_GRADES]: {
    servers: getGrades,
    use: [covergetGrades],
    reducer: merge2State('getGrades'),
  },

  // 更新错误状态
  [ACTION_NAMES.UPDATE_ERROR]: {
    servers: registerService(NAMESPACE),
  },
});

export default {
  namespace: NAMESPACE,

  state: DEFAULT_STATE,

  effects: {
    ...effects,

    *[ACTION_NAMES.SAVE_POSITION]({ payload }, { call }) {
      const { position, resolve, reject } = payload;
      try {
        resolve(yield call(position.id ? updatePosition : createPosition, position));
      } catch( e ) {
        reject(e);
      }
    },

    *[ACTION_NAMES.DELETE_POSITION]({ payload }, { call }) {
      const { id, resolve } = payload;
      const result = yield call(deletePosition, id);
      resolve(result);
    },

    *[ACTION_NAMES.INACTIVE_POSITION]({ payload }, { call }) {
      const { data, resolve } = payload;
      const result = yield call(inactivePosition, data);
      resolve(result);
    },
  },

  reducers: {
    ...reducers,

    [ACTION_NAMES.UPDATE_CONFIRM_INFO]: merge2State('confirmInfo'),
    [ACTION_NAMES.UPDATE_POSITION_TREE]: merge2State('positionTree'),

    updateOrgCusFields(state, { payload }) {
      return {
        ...state,
        formField: composeCustomFieldToFormField(payload),
      };
    },
  },
};
function covergetGrades({ content }) {
  return {
    content,
  };
}

function coverPositionTree({ id, type, master, name, children }) {
  return {
    title: name,
    value: id,
    key: id,
    type,
    master,
    disabled: type === 'company',
    children: children && children.map(coverPositionTree),
  };
}

export function composeCustomFieldToFormField(customField = []) {
  return defaultFormField.concat(
    customField
      .filter(({ active, targetType }) => active && targetType === 'position')
      .sort((field1, field2) => field1.position - field2.field2)
  );
}
