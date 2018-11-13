import { notification } from 'antd';

/**
 *
 * @param {*} type notification组件消息类型
 * @param {*} msg 提示文本
 * @param {*} duration notification组件关闭时间
 */
const Notification = opts => {
  const cfg = Object.assign(
    {},
    {
      duration: 2,
    },
    opts
  );
  return new Promise(resolve => {
    notification[cfg.type]({
      ...cfg,
      onClose: resolve,
    });
  });
};

let debounceTimeoutId = null;
function debounce(cb, ms, use) {
  return (...args) => {
    let newArgs = args;
    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
    }
    if (use && typeof use === 'function') newArgs = use(...newArgs);
    debounceTimeoutId = setTimeout(() => cb(...newArgs), ms);
  };
}

function compose(...fns) {
  return (...args) => fns.reduce((result, fn) => fn(result))(...args);
}

export { Notification, debounce, compose };
