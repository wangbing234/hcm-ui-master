const Department = {
  name: 'department',
  // 去掉数据中没有定义的字段
  additionalProperties: false,
  type: 'object',
  properties: {
    page: { type: 'number' },
    pageSize: { type: 'number' },
    pageTotal: { type: 'number' },
    list: {
      $ref: '#/definitions/item',
    },
  },
  definitions: {
    item: {
      type: ['array'],
      properties: {
        key: { type: 'number' },
        name: { type: 'string' },
        age: { type: 'number' },
        address: { type: 'string' },
      },
    },
  },
};

export default Department;
