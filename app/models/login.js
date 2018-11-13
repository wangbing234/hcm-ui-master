import Cookies from 'js-cookie';
import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { loginByPhone, loginByPassword, getCaptcha } from '../services/login';

const NAMESPACE = 'login';

const ACTION_NAMES = new Actions({
  LOGIN_BY_PHONE: null,
  LOGIN_BY_PASSWORD: null,
  GET_CAPTCHA: null,
  LOGOUT: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取短信验证码
  [ACTION_NAMES.GET_CAPTCHA]: {
    servers: getCaptcha,
  },
  // 手机登录
  [ACTION_NAMES.LOGIN_BY_PHONE]: {
    servers: loginByPhone,
    reducerName: 'doLogin',
    reducer: merge2State('loginData'),
  },
  // 账号登录
  [ACTION_NAMES.LOGIN_BY_PASSWORD]: {
    servers: loginByPassword,
    reducerName: 'doLogin',
    reducer: merge2State('loginData'),
  },
});

export default {
  namespace: NAMESPACE,

  state: {
    loginData: null,
  },

  effects: {
    ...effects,
    // 退出登录
    *[ACTION_NAMES.LOGOUT](_undefined, { call }) {
      yield call(handleLogout);
    },
  },

  reducers: {
    ...reducers,
  },
};

// 登出
function handleLogout() {
  Cookies.remove('authorization', { path: '' });
  window.location.href = '#/sign_in'
};
