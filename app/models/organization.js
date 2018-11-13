import { Actions, createActions } from '../utils/actionUtil';
import OrganizationService from '../services/organization';

const organizationService = new OrganizationService();

const NAMESPACE = 'organization';

const ACTION_NAMES = new Actions({
  FETCH_TREE_DATA: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

export default {
  namespace: NAMESPACE,

  state: {
    treeData: [],
  },

  effects: {
    // 获取菜单数据
    *[ACTION_NAMES.FETCH_TREE_DATA](_undefined, { call, put }) {
      const data = yield call(organizationService.getTreeData.bind(organizationService));
      yield put({
        type: 'updateTree',
        payload: data,
      });
    },
  },

  reducers: {
    // 更新树
    updateTree(state, { payload }) {
      return {
        ...state,
        treeData: [].concat(payload),
      };
    },
  },
};
