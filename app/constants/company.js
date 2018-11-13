import { FIELD_EMNU } from './field';

export const TABLE_DEFAULT_COLUMNS = [
  {
    title: '公司代码',
    dataIndex: 'code',
  },
  {
    title: '公司名称',
    dataIndex: 'name',
  },
  {
    title: '公司简称',
    dataIndex: 'alias',
  },
  {
    title: '上级公司',
    dataIndex: 'parentName',
  },
  {
    title: '公司负责人',
    dataIndex: 'master',
  },
  {
    title: '法人代表',
    dataIndex: 'legalPerson',
  },
  {
    title: '公司地址',
    dataIndex: 'address',
  },
  {
    title: '注册地址',
    dataIndex: 'registerAddress',
  },
  {
    title: '生效日期',
    dataIndex: 'enableTime',
  },
];

export const DEFAULT_FORM_ORDER = [
  'name',
  'alias',
  'code',
  'parentId',
  'master',
  'legalPerson',
  'address',
  'registerAddress',
  'enableTime',
  // 'disableTime',
];

export const DEFAULT_FIELD_CONFIG = {
  name: {
    label: '公司名称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  alias: {
    label: '公司简称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  code: {
    label: '公司代码',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  parentId: {
    label: '上级公司',
    placeholder: '请选择',
    required: true,
  },
  master: {
    label: '公司负责人',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
  },
  legalPerson: {
    label: '法人代表',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
  },
  address: {
    label: '公司地址',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
  },
  registerAddress: {
    label: '注册地址',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
  },
  enableTime: {
    label: '生效日期',
    fieldType: FIELD_EMNU.DATE,
    placeholder: '请选择',
    required: true,
  },
  disableTime: {
    label: '失效日期',
    fieldType: FIELD_EMNU.DATE,
    placeholder: '请选择',
    required: false,
  },
};
