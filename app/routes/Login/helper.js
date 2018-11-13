import Cookies from 'js-cookie';
import { getPageQuery } from 'utils/utils';

export function removeAuth() {
  Cookies.remove('authorization', { path: '' });
}

export function setAuth(auth) {
  Cookies.set('authorization', auth, { expires: 7 }); // 设置登录token信息
}

// 登出跳转
export function logoutRedirect() {
  removeAuth();
  window.location.href = '#/sign_in'
};

// 登录跳转
export function loginRedirect(response) {
  const { ref } = getPageQuery();
  setAuth(response);
  if (ref) {
    window.location.href = ref;
  } else {
    window.location.href = '#/';
  }
}
