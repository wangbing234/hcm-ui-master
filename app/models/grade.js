import { Actions, createActions } from 'utils/actionUtil';
import { DEFAULT_FORM_ORDER, DEFAULT_FIELD_CONFIG } from 'constants/grade';
import { /* show,  */ registerService } from 'utils/createError';
import { merge2State, createModels } from 'utils/modelUtil';
import {
  getGrades,
  getGrade,
  createGrade,
  updateGrade,
  deleteGrade,
  inactiveGrade,
} from '../services/grade';

const NAMESPACE = 'grade';

export const ACTION_NAMES = new Actions({
  GET_GRADES: null,
  GET_GRADE: null,
  SAVE_GRADE: null,
  // CREATE_COMPANY: null,
  // UPDATE_COMPANY: null,
  DELETE_GRADE: null,
  INACTIVE_GRADE: null,

  UPDATE_GRADE_INFO: null,
  UPDATE_CONFIRM_INFO: null,
  UPDATE_FORM_ERROR: null,
  UPDATE_ERROR: null,
});

const defaultFormField = DEFAULT_FORM_ORDER.map(code => ({
  ...DEFAULT_FIELD_CONFIG[code],
  code,
}));
const DEFAULT_STATE = {
  formField: defaultFormField,
};
const GRADE_LIST_REDUCER_NAME = 'gradeList';

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取职级列表
  [ACTION_NAMES.GET_GRADES]: {
    servers: getGrades,
    reducerName: GRADE_LIST_REDUCER_NAME,
    reducer: merge2State('gradeList'),
  },

  // 获取职级信息
  [ACTION_NAMES.GET_GRADE]: {
    servers: getGrade,
    reducerName: ACTION_NAMES.UPDATE_GRADE_INFO,
    reducer: merge2State('gradeInfo'),
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

    *[ACTION_NAMES.SAVE_GRADE]({ payload }, { call }) {
      const { grade, resolve, reject } = payload;
      try {
        resolve(yield call(grade.id ? updateGrade : createGrade, grade));
      } catch( e ) {
        reject(e);
      }
    },
    *[ACTION_NAMES.DELETE_GRADE]({ payload }, { call }) {
      const { id, resolve } = payload;
      const result = yield call(deleteGrade, id);
      resolve(result);
    },
    *[ACTION_NAMES.INACTIVE_GRADE]({ payload }, { call }) {
      const { data, resolve } = payload;
      const result = yield call(inactiveGrade, data);
      resolve(result);
    },
  },

  reducers: {
    ...reducers,

    // [ACTION_NAMES.UPDATE_COMPANY_INFO]: merge2State('companyInfo'),
    [ACTION_NAMES.UPDATE_CONFIRM_INFO]: merge2State('confirmInfo'),

    updateOrgCusFields(state, { payload }) {
      return {
        ...state,
        formField: composeCustomFieldToFormField(defaultFormField, payload),
      };
    },
  },
};

function composeCustomFieldToFormField(defaultForm, customField) {
  return defaultForm.concat(
    customField
      .filter(({ active, targetType }) => active && targetType === 'grade')
      .sort((field1, field2) => field1.position - field2.field2)
  );
}
