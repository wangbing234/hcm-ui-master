import * as Immutable from 'immutable';
import { uid } from 'utils/utils';

// 数据模型
const plainData = [
  {
    fieldType: 'textField',
    attribute: {
      required: false,
      label: '未定义标题',
      length: '',
      placeholder: '请输入该字段',
    },
  },
  {
    fieldType: 'textarea',
    attribute: {
      required: false,
      label: '未定义标题',
      length: '',
      placeholder: '请输入该字段',
    },
  },
  {
    fieldType: 'select',
    attribute: {
      label: '未定义标题',
      required: false,
      options: ['选项1'],
    },
  },
  {
    fieldType: 'multiSelect',
    attribute: {
      label: '未定义标题',
      required: false,
      options: ['选项1'],
    },
  },
  {
    fieldType: 'decimal',
    attribute: {
      label: '未定义标题',
      required: false,
      min: null,
      max: null,
      decimal: 0,
      defaultValue: 0,
    },
  },
  {
    fieldType: 'checkbox',
    attribute: {
      label: '未定义标题',
      required: false,
      options: ['选项1'],
    },
  },
  {
    fieldType: 'radio',
    attribute: {
      label: '未定义标题',
      required: false,
      options: ['选项1'],
    },
  },
  {
    fieldType: 'dateRange',
    attribute: {
      label: '未定义标题',
      required: false,
      format: 'date',
    },
  },
  {
    fieldType: 'date',
    attribute: {
      label: '未定义标题',
      required: false,
      format: 'date',
    },
  },
  {
    fieldType: 'file',
    attribute: {
      label: '未定义标题',
      required: false,
    },
  },
];

const fieldsData = Immutable.fromJS(plainData);

// 根据自定义字段类型取数据
const getFieldDataByFieldType = type => {
  const result = fieldsData
    .find(field => {
      return field.get('fieldType') === type;
    })
    .set('uid', uid());
  return result;
};

export { getFieldDataByFieldType, fieldsData };
