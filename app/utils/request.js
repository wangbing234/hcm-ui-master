import fetch from 'dva/fetch';
import { notification } from 'antd';
import isEmpty from 'lodash/isEmpty';
import Cookies from 'js-cookie';
import querystring from 'querystring';
import { HCMError } from 'utils/createError';

const logout = () => {
  Cookies.remove('authorization', { path: '' });
  window.location.href = `#/sign_in?ref=${window.location.href}`;
};

export function getAuth() {
  return Cookies.get('authorization');
}

export const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
    style: {
      wordBreak: 'break-word',
    },
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export function handleReponseData(response, options) {
  if (options.type && options.type === 'DOWNLOAD') {
    return response.blob();
  } else {
    if (response.status === 204) {
      return response.text();
    }
    return response.json();
  }
}

export function handleBlobData(response, options) {
  if (options.type && options.type === 'DOWNLOAD') {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(response);
    const filename = options.fileName ? options.fileName : 'unknowFile';
    a.href = url;
    a.download = filename;
    a.click();
  }
  return response;
}

export function isBizError(res) {
  return res && typeof res !== 'string' && res.code !== '0';
}

export function handleBizData(res) {
  if (res.code === '11001') {
    logout();
  }

  if (isBizError(res)) {
    throw new HCMError(res);
  }
  return typeof res === 'string' ? res : res.data;
}

export function configOptions(options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  // 为所有的请求设置token
  newOptions.headers = Object.assign({}, newOptions.headers, {
    Authorization: getAuth() || '',
  });
  return newOptions;
}

export function configURL(_url, options) {
  let url = _url;
  const newOptions = options;
  if (newOptions.method === 'GET' && newOptions.body) {
    url = `${url}?${querystring.stringify(newOptions.body)}`;
    // fetch GET HEADER can not have body
    newOptions.body = undefined;
  }
  url = isEmpty(process.env.API_HOST) ? url : process.env.API_HOST + url;
  return url;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(_url, options) {
  const newOptions = configOptions(options);
  const requestURL = configURL(_url, newOptions);

  return fetch(requestURL, newOptions)
    .then(checkStatus)
    .then((res) => handleReponseData(res, newOptions))
    .then((res) => handleBlobData(res, newOptions))
    .then(handleBizData)
}
