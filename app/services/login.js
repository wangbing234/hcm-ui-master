import request from '../utils/request';

export function loginByPhone(data) {
  return request('/api/user/login/verification', {
    method: 'POST',
    body: data,
  });
}

export function loginByPassword(data) {
  return request(`/api/user/login/password`, {
    method: 'POST',
    body: data,
  });
}

export function getCaptcha(phone) {
  return request(`/api/user/phoneCode/${phone}`, {
    method: 'POST',
  });
}
