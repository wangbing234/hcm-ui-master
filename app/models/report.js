import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';

import {
    getReport,
    getRecords,
    exportExcel,
    records,
    accounting,
    accountCancel,
    salaryItem,
} from '../services/report'

export const ACTION_NAMES= new Actions({
    GET_REPORT:null,
    GET_RECORDS:null,
    EXPORT_EXCEL:null,
    RECORDS:null,
    ACCOUNTING:null,
    ACCOUNTING_CANCEL:null,
    SALARY_ITEM:null,
})
const NAMESPACE='report';
const RECORDS_LIST = 'recordsList';
const SALARY='salaryItem'

const DEFAULT_STATE={};
export const actions = createActions(ACTION_NAMES,NAMESPACE);
const { effects, reducers } = createModels({
  // 获取自定义模块
  [ACTION_NAMES.GET_RECORDS]: {
    servers: getRecords,
    reducers: RECORDS_LIST,
    reducer: merge2State('recordsList'),
  },
  [ACTION_NAMES.SALARY_ITEM]: {
    servers: salaryItem,
    reducers: SALARY,
    reducer: merge2State('salaryItem'),
    
  },
});


export default {
    namespace: NAMESPACE,
    state: DEFAULT_STATE,
    effects: {
      ...effects,
      *[ACTION_NAMES.GET_REPORT]( data , { call }) {
        const { payload } = data;
        yield call(getReport, payload);
        
      },
      *[ACTION_NAMES.EXPORT_EXCEL]( data , { call }) {
        // const { payload } = data;
        yield call(exportExcel);
        
      },
      *[ACTION_NAMES.RECORDS]( {payload} , { call }) {
        const { resolve } = payload;
        const result= yield call(records);
        resolve(result);
        
      },
      *[ACTION_NAMES.ACCOUNTING](data ,{ call }) {
        yield call(accounting);
        
      },
      *[ACTION_NAMES.ACCOUNTING_CANCEL](data ,{ call }) {
        yield call(accountCancel);
        
      },
      
      // *[ACTION_NAMES.GET_RECORDS](data,{call}){
      //   const {payload} = data;
      //   yield call(getRecords,payload)
      // },
      
    },
    reducers: {
      ...reducers,
    },
  };