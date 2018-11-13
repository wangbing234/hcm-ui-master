import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import {
  getPersonnel,
  deletePersonnel,
  activePersonnel,
  sortPersonnel,
} from '../services/personnel';

const NAMESPACE = 'personnel';
export const ACTION_NAMES = new Actions({
  GET_PERSONNEL: null,
  DELETE_PERSONNEL: null,
  ACTIVE_PERSONNEL: null,
  SORT_PERSONNEL: null,
});
const DEFAULT_STATE = [];
export const actions = createActions(ACTION_NAMES, NAMESPACE);
const PERSONNEL_LIST_REDUCER_NAME = 'personnelList';
const { effects, reducers } = createModels({
  // 获取自定义模块
  [ACTION_NAMES.GET_PERSONNEL]: {
    servers: getPersonnel,
    use: [test],
    reducers: PERSONNEL_LIST_REDUCER_NAME,
    reducer: merge2State('personnelList'),
  },
});

export default {
  namespace: NAMESPACE,
  state: DEFAULT_STATE,
  effects: {
    ...effects,
    *[ACTION_NAMES.DELETE_PERSONNEL]( data , { call }) {
      window.console.log(data)
      const { payload } = data;
      const result = yield call(deletePersonnel, payload.id);
      payload.resolve(result);
    },
    *[ACTION_NAMES.ACTIVE_PERSONNEL]({ payload }, { call }) {
      const { id,resolve } = payload;
      const active = payload.enable;
      const data = {};
      data.id = id;
      data.request = {};
      data.request.enable = active;
      const response= yield call(activePersonnel, data);
      resolve(response)
    },
    *[ACTION_NAMES.SORT_PERSONNEL]({ payload }, { call }) {
      // yield call(sortPersonnel, payload);
      const {ids, resolve} = payload;
      const response = yield call(sortPersonnel, ids);
      resolve(response);

    },
  },
  reducers: {
    ...reducers,
  },
};


function test(res) {
  return res;
}