function key2MenuItemMapByEntry(entry) {
  return key => ({ key, label: entry[key] });
}

export const FIELD_EMNU = {
  TEXT: 'textField',
  TEXTAREA: 'textarea',
  DECIMAL: 'decimal',
  SELECT: 'select',
  MULTI_SELECT: 'multiSelect',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  DATE_RANGE: 'dateRange',
  FILE: 'file',
};

export const ORDER_FIELD_TYPE = [FIELD_EMNU.TEXT, FIELD_EMNU.SELECT, FIELD_EMNU.DATE];

// 自定义字段文本
export const FIELD_TYPE = {
  [FIELD_EMNU.TEXT]: '单行文本',
  [FIELD_EMNU.TEXTAREA]: '多行文本',
  [FIELD_EMNU.DECIMAL]: '数字',
  [FIELD_EMNU.SELECT]: '下拉单选',
  [FIELD_EMNU.MULTI_SELECT]: '下拉复选',
  [FIELD_EMNU.RADIO]: '单选勾选',
  [FIELD_EMNU.CHECKBOX]: '复选勾选',
  [FIELD_EMNU.DATE]: '日期选择',
  [FIELD_EMNU.DATE_RANGE]: '日期区间选择',
  [FIELD_EMNU.FILE]: '附件选择',
};

// 自定义字段图标（UUIcon）
export const FIELD_ICON = {
  [FIELD_EMNU.TEXT]: 'icon-text-s',
  [FIELD_EMNU.TEXTAREA]: 'icon-text-m',
  [FIELD_EMNU.DECIMAL]: 'icon-text-num',
  [FIELD_EMNU.SELECT]: 'icon-o-down',
  [FIELD_EMNU.MULTI_SELECT]: 'icon-o-down',
  [FIELD_EMNU.RADIO]: 'icon-o',
  [FIELD_EMNU.CHECKBOX]: 'icon-ii-1',
  [FIELD_EMNU.DATE_RANGE]: 'icon-calendar',
  [FIELD_EMNU.DATE]: 'icon-time',
  [FIELD_EMNU.FILE]: 'icon-paper-clip',
};

export const FIELD_TYPE_ITEMS = ORDER_FIELD_TYPE.map(key2MenuItemMapByEntry(FIELD_TYPE));

export const TARGET_TYPE = {
  company: '公司',
  department: '部门',
  position: '岗位',
  grade: '职级',
};

export const TARGET_TYPE_ITEMS = Object.keys(TARGET_TYPE).map(key2MenuItemMapByEntry(TARGET_TYPE));

// 获取所有字段类型对应的名字
export const ALL_FIELD_TEXT = Object.values(FIELD_EMNU).map(key2MenuItemMapByEntry(FIELD_TYPE));
