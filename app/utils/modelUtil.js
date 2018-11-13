/* eslint-disable */

export function merge2State(stateName) {
  return function merge(state, { payload }) {
    return {
      ...state,
      [stateName]: payload,
    };
  };
}

export function createModels(configs) {
  const effects = {};
  const reducers = {};

  Object.keys(configs).forEach(key => {
    const { servers, use = [], reducerName, reducer } = configs[key];
    const realReducerName = reducerName || `${key} + REDUCER`;
    effects[key] = function* effect(action, { call, put }) {
      const { payload } = action;
      yield* use
        // dispatch to reducer
        .concat(function* putReducer(res) {
          yield put({
            type: realReducerName,
            payload: res,
            meta: payload,
          });
        })
        // middleware
        .reduce(function* middleware(_result, current) {
          let result = _result;
          if (result && result.next) {
            result = yield* result;
          }
          let newResult = current(result, action, { call, put });
          if (newResult && newResult.next) {
            newResult = yield* newResult;
          }
          return newResult;
          // call api
        }, yield call(servers, payload, { call, put }));
    };

    // promise effect
    effects[`${key}/promise`] = function* promiseEffect({ payload, meta }, { call }) {
      // call api and resolve result
      try{
        meta.resolve(yield call(servers, payload));
      } catch(e) {
        console.log(e);
        meta.reject(e);
      }
    };

    if (reducer) {
      reducers[realReducerName] = reducer;
    }
  });

  return {
    effects,
    reducers,
  };
}
