import { checkModel } from '../utils/schemaUtil';

export function CheckModel(schema) {
  return (target, name, descriptor) => {
    const oldValue = descriptor.value;
    return Object.assign({}, descriptor, {
      value(...args) {
        return oldValue.apply(this, args).then(response => {
          // 打印错误
          const err = checkModel(schema, response);
          if (err && window.console) window.console.log(response);
          // CheckModel 装饰器作用与 service 中的 async 方法，所有入参和出参都是 promise
          return response;
        });
      },
    });
  };
}
