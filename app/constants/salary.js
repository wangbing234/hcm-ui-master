import { FIELD_EMNU } from './field';

/* 薪资项相关 */
function key2MenuItemMapByEntry(entry) {
  return key => ({ key, label: entry[key] });
}

export const SALARY_EMPLOYEE_STATUS = {
  ALL: 'all',
  FORMAL: 'formal',
  ADJUST: 'adjust',
  FORMER: 'former',
};

export const SALARY_LIST_TABS = [{
  key: SALARY_EMPLOYEE_STATUS.ALL,
  title: '全部',
}, {
  key: SALARY_EMPLOYEE_STATUS.FORMAL,
  title: '入职',
}, {
  key: SALARY_EMPLOYEE_STATUS.ADJUST,
  title: '调薪',
}, {
  key: SALARY_EMPLOYEE_STATUS.FORMER,
  title: '离职',
} ];
export const SALARY_REPORT=[{
  ALL: 'all',
}]
export const SALARY_REPORT_TABS=[{
  key: SALARY_REPORT.ALL,
  title: '全部数据',
}]
export const SALARY_DETAIL_CLASSIFY = {
  MONTHLY_DETAIL: '本月明细',
  SALARY_INFO: '薪酬信息',
  SECURITY_INFO: '五险一金',
};

export const SALARY_DETAIL_TABS = [
  SALARY_DETAIL_CLASSIFY.MONTHLY_DETAIL,
  SALARY_DETAIL_CLASSIFY.SALARY_INFO,
  SALARY_DETAIL_CLASSIFY.SECURITY_INFO,
];

export const MONTHLY_DETAIL_LAYOUT = {

}

export const SALARY_INFO_LAYOUT = [
  {
    id: 'info',
    title: '基本工资',
    formField: [{
      fieldType: FIELD_EMNU.TEXT,
      code: 'money',
      required: true,
      label: '基本工资',
      placeholder: '请输入',
    }],
  },
  {
    id: 'bankInfo',
    title: '银行卡信息',
    formField: [{
      fieldType: FIELD_EMNU.TEXT,
      code: 'cardNo',
      required: true,
      label: '银行卡号',
      placeholder: '请输入',
    }, {
      fieldType: FIELD_EMNU.TEXT,
      code: 'bankName',
      required: true,
      label: '银行名称',
      placeholder: '请输入',
    }, {
      fieldType: FIELD_EMNU.TEXT,
      code: 'bankAddress',
      required: true,
      label: '开户行',
      placeholder: '请输入',
    } ],
  },
  {
    id: 'threshold',
    title: '免税额',
    formField: [{
      fieldType: FIELD_EMNU.SELECT,
      required: true,
      label: '免税额',
      placeholder: '请选择',
      options: [],
    } ],
  },
];

// 薪资项类型枚举
export const SALARY_TYPES_ENUM = {
  'taxBeforeAdd': '税前加项',
  'taxBeforeMinus': '税前减项',
  'taxAfterAdd': '税后加项',
  'taxAfterMinus': '税后减项',
  'external': '人力成本项',
  'laborCost': '不直接参与薪资计算项',
}
export const SALARY_TYPES =  Object.keys(SALARY_TYPES_ENUM).map(key2MenuItemMapByEntry(SALARY_TYPES_ENUM));


// 小数点保留位数枚举
export const SALARY_SCALE_RULES_ENUM= {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
}
export const SALARY_SCALE_RULES =  Object.keys(SALARY_SCALE_RULES_ENUM).map(key2MenuItemMapByEntry(SALARY_SCALE_RULES_ENUM));


// 小数点进位规则枚举
export const SALARY_POINT_RULES_ENUM= {
  'round': '四舍五入',
  'floor': '直接保留',
}
export const SALARY_POINT_RULES =  Object.keys(SALARY_POINT_RULES_ENUM).map(key2MenuItemMapByEntry(SALARY_POINT_RULES_ENUM));

export const SOCIAL_SECURITY_PLAN_CONFIG = {
  "birthEmployerRatio": '',
  "birthPersonalRatio": '',
  "effectDate": '',
  "historyEmployerRatio": '',
  "historyPersonalRatio": '',
  "injuryEmployerRatio": '',
  "injuryPersonalRatio": '',
  "limitDown": '',
  "limitPoint": '',
  "limitUp": '',
  "name": '',
  "outworkEmployerRatio": '',
  "outworkPersonalRatio": '',
  "pensionEmployerRatio": '',
  "pensionPersonalRatio": '',
  "pointRule": '',
  "pointScale": '',
}

export const HOUSING_FUND_PLAN_CONFIG = {
  "effectDate": '',
  "fundAddingEmployerRatio": '',
  "fundAddingPersonalRatio": '',
  "fundEmployerRatio": '',
  "fundPersonalRatio": '',
  "limitDown": '',
  "limitPoint": '',
  "limitUp": '',
  "name": '',
  "pointRule": '',
  "pointScale": '',
}
