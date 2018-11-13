import Blog from './Blog';

const User = {
  name: 'user',
  // 去掉数据中没有定义的字段
  additionalProperties: false,
  type: 'object',
  properties: {
    roleId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string' },
    blog: { $ref: Blog.name },
  },
};

export default User;
