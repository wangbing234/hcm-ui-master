import { FIELD_EMNU } from './field';

export const TABLE_DEFAULT_COLUMNS = [
  {
    title: '职级代码',
    dataIndex: 'code',
  },
  {
    title: '职级名称',
    dataIndex: 'name',
  },
  {
    title: '职级简称',
    dataIndex: 'alias',
  },
  {
    title: '职级级别',
    dataIndex: 'rank',
  },
  {
    title: '生效日期',
    dataIndex: 'enableTime',
  },
];

export const DEFAULT_FORM_ORDER = ['name', 'alias', 'code', 'rank', 'enableTime'];

export const DEFAULT_FIELD_CONFIG = {
  name: {
    label: '职级名称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  alias: {
    label: '职级简称',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  code: {
    label: '职级代码',
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '请输入',
    required: true,
  },
  rank: {
    label: '职级选择',
    fieldType: FIELD_EMNU.SELECT,
    placeholder: '请选择',
    required: true,
    options: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
    ],
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
