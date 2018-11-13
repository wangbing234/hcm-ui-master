/**
 * @UI：【设置-薪资设置-薪资项设置】
 * @author: yukai@youzhao.io
 */

import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import {
  getSalaryList,
  delSalaryItem,
  getSalaryOption,
  createSalaryItem,
} from '../services/settingSalarySetting';

export const NAMESPACE = 'settingSalarySetting';

export const ACTION_NAMES = new Actions({
  RESET_STATE: null, // 重置state
  FETCH_SALARY_LIST: null, // 获取薪资项列表
  DEL_SALARY_ITEM: null, // 删除薪资项
  FETCH_SALARY_OPTION: null, // 获取薪资项列表包含内置
  SAVE_SALARY_FORM: null, // 保存薪资项

});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取薪资项列表
  [ACTION_NAMES.FETCH_SALARY_LIST]: {
    servers: getSalaryList,
    reducerName: 'updateSalaryList',
    reducer: merge2State('salaryList'),
  },

  // 删除薪资项
  [ACTION_NAMES.DEL_SALARY_ITEM]: {
    servers: delSalaryItem,
  },

  // 获取薪资项列表包含内置
  [ACTION_NAMES.FETCH_SALARY_OPTION]: {
    servers: getSalaryOption,
    use: [formatOptionCode],
    reducerName: 'salaryOption',
    reducer: merge2State('salaryOption'),
  },

  // 保存薪资项
  [ACTION_NAMES.SAVE_SALARY_FORM]: {
    servers: createSalaryItem,
  },
});


const INITIALSTATE = {
  salaryList: [],
  salaryOption: [],
};

export default {
  namespace: NAMESPACE,

  state: INITIALSTATE,

  effects: {
    ...effects,
  },

  reducers: {
    ...reducers,
  },
};

// 格式化薪资计算项的 code
function formatOptionCode(res) {
  return res.map(_item => {
    const item = _item;
    item.code = '${' + item.code + '}'; // eslint-disable-line
    return item;
  });
}
