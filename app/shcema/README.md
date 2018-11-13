# 基于json-shcema的接口数据类型检查

## 基本原理
service中请求的数据，会根据装时器中传入的model进行解析，如果返回数据和预先定义的model结构不同，打印相应的错误信息。

## 基本用法

1. 在写service时，使用class的方式，继承baseService
```javascript
import BaseService from './BaseService';
import { CheckModel } from '../decorators/Check';
import User from '../shcema/User';

export default class GlobalService extends BaseService {
  @CheckModel(User)
  queryUser() {
    return this.request('/api/user');
  }

  queryMenus() {
    return this.request('/api/menus');
  }
}
```

2. 定义请求接口的model。model的格式遵循json-schema的标中。因为使用ajv进行解析，所有这里用js对model进行定义。在model的第一层，增加了自定义的字段name，用来表示model的名称。在通过$ref复用其它model时，作为需要复用model的名称。
```javascript
// User.js
import Blog from './Blog';

const User = {
  name: 'user',
  // 去掉数据中没有定义的字段
  additionalProperties: false,
  type: 'object',
  properties: {
    // "roleId": { "type": "number" },
    id: { type: 'number' },
    name: { type: 'number' },
    blog: { $ref: Blog.name }, // reuse Blog model
  },
};

export default User;

---

// Blog.js
const Blog = {
  name: 'blog',
  additionalProperties: false,
  type: 'object',
  properties: {
    // "roleId": { "type": "number" },
    id: { type: 'number' },
    title: { type: 'number' },
  },
};

export default Blog;
```

3. 为service请求接口的方法加上@CheckModel装饰器，并传入期望返回数据的model

## 学习资料
json-schema官方教程 [json-schema](http://json-schema.org/learn/getting-started-step-by-step.htmls)

javascript的json-schema解析库 [ajv](https://ajv.js.org/) 

