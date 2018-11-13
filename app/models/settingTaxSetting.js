import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { getTaxList,editTax } from '../services/settingTaxSetting';

const NAMESPACE = 'settingTaxSetting';

const ACTION_NAMES = new Actions({
    GET_TAX_LIST: null,
    EDIT_TAX: null,
});


export const actions = createActions(ACTION_NAMES, NAMESPACE);
const { effects, reducers } = createModels({
   // 获取免税额列表
    [ACTION_NAMES.GET_TAX_LIST]: {
      servers: getTaxList,
      reducerName: 'taxList',
      reducer: merge2State('taxList'),
    },
    // 修改免税额
    [ACTION_NAMES.EDIT_TAX]: {
      servers: editTax,
    },
  });

  export default {
    namespace: NAMESPACE,
  
    state: {
        getTaxList: null,
    },
  
    effects: {
      ...effects,
    },
    reducers: {
      ...reducers,
    },
  };
