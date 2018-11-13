import { FIELD_EMNU } from './field';

export const TABLE_DEFAULT_COLUMNS = [
  {
    title: '部门代码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '部门名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '部门简称',
    dataIndex: 'alias',
    key: 'alias',
  },
  {
    title: '所属公司',
    dataIndex: 'parentCompanyName',
    key: 'parentCompanyName',
  },
  {
    title: '上级部门',
    dataIndex: 'parentDepartmentName',
    key: 'parentDepartmentName',
  },
  {
    title: '部门负责人',
    dataIndex: 'master',
    key: 'master',
  },
  {
    title: '编制',
    dataIndex: 'formation',
    key: 'formation',
  },
  {
    title: '生效日期',
    dataIndex: 'enableTime',
    key: 'enableTime',
  },
];

export const DEFAULT_FORM_ORDER = [
  'name',
  'alias',
  'code',
  'parentId',
  'master',
  'formation',
  'enableTime',
  // 'disableTime',
];

export const DEFAULT_FIELD_CONFIG = {
  name: {
    label: '部门名称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  alias: {
    label: '部门简称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  code: {
    label: '部门代码',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  parentId: {
    label: '所属公司或部门',
    placeholder: '请选择',
    required: true,
  },
  master: {
    label: '部门负责人',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
  },
  formation: {
    label: '编制',
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
