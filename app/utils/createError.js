export const SHOW = '@@HCM_ERROR/SHOW';
export const HIDE = '@@HCM_ERROR/HIDE';
const NAMESPACE = 'error';

export function HCMError(meta) {
  Error.call(this);
  if (meta) {
    this.meta = meta;
  }
}

export function show(namespace, meta) {
  return {
    type: SHOW,
    payload: {
      namespace,
      meta,
    },
  };
}
export function hide(namespace) {
  return {
    type: HIDE,
    payload: {
      namespace,
    },
  };
}

// Deprecated, use `effectErrorForm`
export function registerService(namespace) {
  return function* service(payload, { put }) {
    yield put(show(namespace, payload));
  };
}

function removeEmptyError( oldFromError = {}, formError ) {
  const newFormError = { ...oldFromError };
  let hasChange = false;
  if( formError ) {
    Object.keys( formError ).forEach(code => {
      let msg = formError[code];

      if( typeof msg === 'object' ) {
        msg = removeEmptyError(newFormError[code], msg);
      }

      if (newFormError[code] !== msg){
        hasChange = true;
        if (msg) {
          newFormError[code] = msg;
        } else {
          delete newFormError[code];
        }
      }
    });
  } else {
    return formError;
  }

  if (Object.keys(newFormError).length === 0) {
    return undefined;
  }
  if (hasChange) {
    return newFormError;
  }

  return oldFromError;
}

export function effectErrorForm( actionName, namespace ) {
  return {
    *[actionName]({ payload }, { put }) {
      const { error, formError } = payload;
      const { form } = error || {};
      const newFormError = removeEmptyError(form, formError);
      if( newFormError !== form ) {
        yield put(show(namespace, {
          form: newFormError,
        }));
      }
    },
  }
}

const initialState = {
  global: false,
  models: {},
};
const extraReducers = {
  [NAMESPACE](state = initialState, { type, payload }) {
    const { namespace, effect, meta } = payload || {};
    let ret;
    switch (type) {
      case SHOW:
        ret = {
          ...state,
          [namespace]: {
            ...state[namespace],
            ...(effect ? { [effect]: meta } : meta),
          },
        };
        break;
      case HIDE:
        ret = {
          ...state,
          models: {
            ...state.models,
            [namespace]: false,
          },
        };
        break;
      default:
        ret = state;
        break;
    }
    return ret;
  },
};

function onError(err, dispatch, { key }) {
  if (err instanceof HCMError) {
    const [namespace, ...rest] = key.split('/');
    if( !~rest.indexOf('promise') ) {
      dispatch({
        type: SHOW,
        payload: {
          namespace,
          meta: err.meta,
          effect: rest.join('/'),
        },
      });
      err.preventDefault();
    }
  }
}

export default function createError() {
  return {
    extraReducers,
    onError,
  };
}
