const OrganizationTree = {
  additionalProperties: false,
  name: 'organization',
  type: ['object', 'array'],
  properties: {
    id: { type: 'number' },
    uid: { type: 'string' },
    name: { type: 'string' },
    code: { type: 'string' },
    type: { type: 'string' },
    parentCompanyId: { type: 'number' },
    parentDepartmentId: { type: 'number' },
    master: { type: 'string' },
    children: {
      $ref: '#',
    },
  },
};

export default OrganizationTree;
