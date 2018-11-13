const OrgSetting = {
  name: 'setting',
  additionalProperties: false,
  type: 'object',
  properties: {
    code: { type: 'string' },
    message: { type: 'string' },
    data: {
      type: 'array',
      properties: {
        id: { type: 'number' },
        active: { type: 'boolean' },
        code: { type: 'string' },
        fieldType: { type: 'string' },
        label: { type: 'string' },
        length: { type: 'number' },
        options: { type: 'array' },
        placeholder: { type: 'string' },
        position: { type: 'number' },
        required: { type: 'boolean' },
        targetType: { type: 'string' },
      },
    },
  },
};

export default OrgSetting;
