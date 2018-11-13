import * as Immutable from 'immutable';
import { Actions, createActions } from 'utils/actionUtil';
import { registerService } from 'utils/createError';
import { hasDuplicates, hasEmpty } from 'utils/utils';
import { createModels } from 'utils/modelUtil';
import {
  getCustomizedForms,
  submitCustomizedForms,
  editCustomizedForms,
} from '../services/settingPersonnelDetail';

const NAMESPACE = 'settingPersonnelDetail';

export const ACTION_NAMES = new Actions({
  RESET_STATE: null, // 重置state
  RESET_ERROR: null,

  FETCH_FORM: null, // 获取 server 数据
  SUBMIT_FORM: null, // 提交表单
  EDIT_FORM: null, // 编辑表单

  UPDATE_FORM: null, // 更新表单
  UPDATE_FORM_ERROR: null, // 更新表单错误

  ADD_FIELD: null, // 添加字段
  DEL_FIELD: null, // 删除字段
  SWAP_FIELD: null, // 交换字段
  SELECT_FIELD: null, // 选中字段
  UPDATE_FIELD: null, // 更新字段
  ADD_OR_DEL_OPTION: null, // 增加或删除选项
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 新建提交
  [ACTION_NAMES.SUBMIT_FORM]: {
    servers: submitCustomizedForms,
  },
  // 编辑提交
  [ACTION_NAMES.EDIT_FORM]: {
    servers: editCustomizedForms,
  },
  // 重置错误
  [ACTION_NAMES.RESET_ERROR]: {
    servers: registerService(NAMESPACE),
  },
});

const INITIALSTATE = {
  formData: Immutable.fromJS({
    title: '', // 模块名称
    multiRecord: false, // 是否支持多条记录
    required: true, // 该模块是否必填
    onBoard: false, // 员工入职时是否启用
  }),
  formError: Immutable.fromJS({}), // 表单错误信息

  fields: Immutable.fromJS([]), // 所有字段数据
  selectedField: Immutable.fromJS({}), // 选中的字段
  selectedIndex: -1, // 选中的字段索引

  fieldError: Immutable.fromJS({
    duplicateOption: {}, // 标记重复的选项
    emptyOption: {}, // 标记为空的选项
    emptyLabel: {}, // 标记为空的标题
  }),
};

export default {
  namespace: NAMESPACE,

  state: INITIALSTATE,

  effects: {
    ...effects,
    // 重置 state
    *[ACTION_NAMES.RESET_STATE]({ payload }, { put }) {
      yield put({
        type: 'resetState',
        payload,
      });
    },
    // 更新表单错误
    *[ACTION_NAMES.UPDATE_FORM_ERROR]({ payload }, { put }) {
      yield put({
        type: 'updateFormError',
        payload,
      });
    },
    // 获取数据
    *[ACTION_NAMES.FETCH_FORM]({ payload }, { put, call }) {
      const response = yield call(getCustomizedForms, payload);
      yield put({
        type: 'fetchFormData',
        payload: response,
      });
    },
    // 更新表单数据
    *[ACTION_NAMES.UPDATE_FORM]({ payload }, { put }) {
      yield put({
        type: 'updateForm',
        payload,
      });
    },
    // 添加字段
    *[ACTION_NAMES.ADD_FIELD]({ payload }, { put }) {
      yield put({
        type: 'addField',
        payload,
      });
    },
    // 删除字段
    *[ACTION_NAMES.DEL_FIELD]({ payload }, { put }) {
      yield put({
        type: 'delField',
        payload,
      });
    },
    // 选中字段
    *[ACTION_NAMES.SELECT_FIELD]({ payload }, { put }) {
      yield put({
        type: 'selectField',
        payload,
      });
    },
    // 交换字段
    *[ACTION_NAMES.SWAP_FIELD]({ payload }, { put }) {
      yield put({
        type: 'swapField',
        payload,
      });
    },
    // 更新字段
    *[ACTION_NAMES.UPDATE_FIELD]({ payload }, { put }) {
      yield put({
        type: 'updateField',
        payload,
      });
    },
    // 删除或添加选项
    *[ACTION_NAMES.ADD_OR_DEL_OPTION]({ payload }, { put }) {
      yield put({
        type: 'addOrDelOption',
        payload,
      });
    },
  },

  reducers: {
    ...reducers,
    resetState() {
      return INITIALSTATE;
    },
    // 更新表单错误
    updateFormError(state, { payload }) {
      return {
        ...state,
        formError: payload,
      };
    },
    // 获取服务端数据
    fetchFormData(state, { payload }) {
      const { fields, formData } = state;
      const { fields: serverFields, id, code, ...rest } = payload;
      const newFields = fields.clear().concat(Immutable.fromJS(serverFields));
      const newFormData = formData.merge(rest);
      return {
        ...state,
        formData: newFormData,
        fields: newFields,
      };
    },
    // 更新表单
    updateForm(state, { payload }) {
      const { formData } = state;
      const { code, value } = payload;
      const newFormData = formData.set(code, value);
      return {
        ...state,
        formData: newFormData,
      };
    },
    // 添加字段
    addField(state, { payload }) {
      const { fields } = state;
      const newFields = fields.push(payload);
      return {
        ...state,
        fields: newFields,
      };
    },
    // 删除字段
    delField(state, { payload }) {
      const { fields, selectedField, fieldError} = state;
      const newFields = fields.delete(payload);
      const uid = getUid(selectedField);

      // 删除字段时移除错误记录
      const newFieldError = fieldError
        .deleteIn(['duplicateOption', uid])
        .deleteIn(['emptyOption', uid])
        .deleteIn(['emptyLabel', uid]);

      return {
        ...state,
        fieldError: newFieldError,
        selectedField: selectedField.clear(),
        fields: newFields,
      };
    },
    // 选中字段
    selectField(state, { payload }) {
      const { fields } = state;
      const newFields = fields.map((_field, index) => {
        let field = _field;
        if (payload === index) {
          field = field.set('selected', true);
        } else {
          field = field.set('selected', false);
        }
        return field;
      });
      return {
        ...state,
        selectedField: newFields.get(payload),
        selectedIndex: payload,
        fields: newFields,
      };
    },
    // 交换字段
    swapField(state, { payload }) {
      const { index, targetIndex } = payload;
      const { fields } = state;
      const currentField = fields.get(index);
      const targetField = fields.get(targetIndex);
      const newFields = fields.set(index, targetField).set(targetIndex, currentField);

      return {
        ...state,
        selectedIndex: targetIndex,
        fields: newFields,
      };
    },
    // 更新字段
    updateField(state, { payload }) {
      const { fields, selectedField, selectedIndex, fieldError } = state;
      const { code, value, index } = payload;
      const uid = getUid(selectedField);
      let newValue = value;
      let newFieldError = fieldError;

      if (code === 'options') {
        newValue = selectedField.getIn(['attribute', code]).set(index, value);
        // 验证是否有重复选项 and 验证是否有为空的选项
        newFieldError = fieldError
          .setIn(['duplicateOption', uid], hasDuplicates(newValue.toJS()))
          .setIn(['emptyOption', uid], hasEmpty(newValue.toJS()));
      }
      if (code === 'label') {
        // 验证是否有为空的标题
        newFieldError = fieldError.setIn(['emptyLabel', uid], !newValue);
      }

      const newSelectedField = selectedField.setIn(['attribute', code], newValue);
      const newFields = fields.set(selectedIndex, newSelectedField);


      return {
        ...state,
        fieldError: newFieldError,
        selectedField: newSelectedField,
        fields: newFields,
      };
    },
    // 添加或删除选项
    addOrDelOption(state, { payload }) {
      const { fields, selectedField, selectedIndex, fieldError } = state;
      const options = selectedField.getIn(['attribute', 'options']);
      const uid = getUid(selectedField);
      let newOptions = null;
      if (payload) {
        // 删除
        newOptions = options.delete(payload);
      } else {
        // 添加
        newOptions = options.push(`选项${options.size + 1}`);
      }
      const newSelectedField = selectedField.setIn(['attribute', 'options'], newOptions);
      const newFields = fields.set(selectedIndex, newSelectedField);

      // 验证是否有重复选项 and 验证是否有为空的选项
      const newFieldError = fieldError
      .setIn(['duplicateOption', uid], hasDuplicates(newOptions.toJS()))
      .setIn(['emptyOption', uid], hasEmpty(newOptions.toJS()));

      return {
        ...state,
        fieldError: newFieldError,
        selectedField: newSelectedField,
        fields: newFields,
      };
    },
  },
};

function getUid(immutableObj){
  return immutableObj.get('uid') || immutableObj.get('id');
}
