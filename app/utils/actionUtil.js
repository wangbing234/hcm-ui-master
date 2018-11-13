export function createActions(actionTypes, namespace) {
  return Object.keys(actionTypes).reduce((result, action) => {
    return Object.assign(result, {
      // EffectAction :: (Dispatch, Action) -> Void
      [action]: (dispatch, { payload, meta, error } = {}) => {
        dispatch({
          type: `${namespace}/${action}`,
          payload,
          meta,
          error,
        });
      },
    });
  }, {});
}

export class Actions {
  constructor(actionTypes) {
    Object.assign(
      this,
      Object.keys(actionTypes).reduce((result, action) => {
        return Object.assign(result, {
          [action]: action,
        });
      }, {})
    );
  }
}

/*
通用业务组件完成自身api调用后通知业务组件回调 简化版
https://dvajs.com/guide/develop-complex-spa.html#%E8%B7%A8model%E7%9A%84%E9%80%9A%E4%BF%A1

this.promiseDispatch = createPromiseDispatch();
...
this.promiseDispatch(DELETE_COMPANY, companyId)
  .then(...)
*/
export function createPromiseDispatch() {
  // promiseDispatch :: (EffectAction, Payload, Meta, Error) -> Promise
  return function promiseDispatch(fn, payload, meta, error) {
    const { dispatch } = this.props;
    return new Promise((resolve, reject) => {
      fn(({ type }) => {
        dispatch({
          type: `${type}/promise`,
          payload,
          meta: { ...meta, resolve, reject },
          error,
        });
      });
    });
  };
}
