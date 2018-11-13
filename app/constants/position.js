import { FIELD_EMNU } from './field';

export const TABLE_DEFAULT_COLUMNS = [
  {
    title: '岗位代码',
    dataIndex: 'code',
  },
  {
    title: '岗位名称',
    dataIndex: 'name',
  },
  {
    title: '岗位简称',
    dataIndex: 'alias',
  },
  {
    title: '所属部门',
    dataIndex: 'departmentName',
  },
  {
    title: '上级岗位',
    dataIndex: 'parentPositionName',
  },
  {
    title: '职级',
    dataIndex: 'gradeName',
  },
  {
    title: '部门负责人',
    dataIndex: 'master',
  },
  {
    title: '生效日期',
    dataIndex: 'enableTime',
  },
];

export const DEFAULT_FORM_ORDER = [
  'name',
  'alias',
  'departmentId',
  'master',
  'parentPositionName',
  'parentPositionId',
  'gradeName',
  'gradeId',
  'enableTime',
  // 'disableTime',
  'code',
];

export const DEFAULT_FIELD_CONFIG = {
  name: {
    label: '岗位名称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  alias: {
    label: '岗位简称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  departmentId: {
    label: '所属部门',
    placeholder: '请输入',
    required: true,
  },
  master: {
    label: '部门负责人',
    placeholder: '禁止输入',
    // required: true,
  },
  parentPositionName: {
    label: '上级岗位名称',
    placeholder: '请输入',
  },
  parentPositionId: {
    label: '上级岗位id',
    placeholder: '禁止输入',
    // required: true,
  },
  gradeName: {
    label: '职级名称',
    placeholder: '请输入',
    required: true,
  },
  gradeId: {
    label: '职级id',
    placeholder: '禁止输入',
    // required: true,
  },
  enableTime: {
    label: '生效日期',
    fieldType: FIELD_EMNU.DATE,
    placeholder: '请输入',
    required: true,
  },
  disableTime: {
    label: '失效日期',
    fieldType: FIELD_EMNU.DATE,
    placeholder: '请选择',
    required: false,
  },
  code: {
    label: '岗位代码',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
};
