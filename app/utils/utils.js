import moment from 'moment';
import uuid from 'uuid';
import { parse, stringify } from 'qs';
import { uniq } from 'lodash';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

/**
 * 获得匹配选择器的第一个祖先元素，类似jQuery中的closest
 * @param {Dom Object} el 当前元素
 * @param {String} 目标元素选择器
 * @return {Dom Object} el 获取到的元素
 */
export function closest(el, selector) {
  const matchesSelector =
    el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement; // eslint-disable-line
  }
  return el;
}

/**
 * 树形菜单转成 flat 格式
 * @param {Object} data 当前元素
 * @return {Object} res flat data
 */
export function tree2flat(data) {
  const res = [];
  const loop = _data => {
    _data.forEach(item => {
      const { children, ...rest } = item;
      res.push({ ...rest });
      if (children) {
        loop(children);
      }
    });
  };
  loop(data);
  return res;
}

export function wrapUniqueKey(type, id, name) {
  return `${type}-${id}-${name}`;
}

export function getIdFromKey(key) {
  return !!key && !!key.split('-').length && parseInt(key.split('-')[1], 10);
}

export function uid() {
  return uuid();
}

// 统计数组中指定元素出现的次数
export function countArray(arr, val) {
  let count = 0;
  let pos = 0;
  while (pos < arr.length) {
    pos = arr.indexOf(val, pos);
    if (pos === -1) { // 未找到就退出
      break;
    }
    count += 1; // 找到就自增
    pos += 1; // 并从下个位置开始搜索
  }
  return count;
}

// 判断数据是否有重复的项
export function hasDuplicates(arr) {
  return uniq(arr).length !== arr.length;
}

// 判断数据是否为为空的项
export function hasEmpty(arr) {
  return !arr.every(item => {
    return item !== '';
  });
}

// 移除base64后字符串的头信息
export function removeDataBase64(str = '') {
  const res = str.match(/^data:.+\/(.+);base64,(.*)$/);
  if( res && res.length > 1) {
    return res[2];
  }
  return '';
}

// 字符串替换
export function strTemplate( tpl, ...args ) {
  return args.reduce( ( str, arg, idx ) => {
    return ~str.indexOf(`{${idx}}`) ? str.replace(new RegExp(`\\{${idx}\\}`, 'g'), arg) : str
  }, tpl );
}

// 检测必填
export function checkRequire( value ) {
  return [null, undefined, ''].every( nil => nil !== value );
}

// 检测最大长度
export function checkLength( val, limitLength ) {
  if( val ) {
    return val.length < limitLength;
  }
  return true;
}

// 检测数字
export function isNumeric (x) {
  return ((typeof x === 'number' || typeof x === 'string') && !isNaN(Number(x)));
}

// 检测ID
export function checkId(id) {
  return /^(\d|[a-zA-Z]){0,8}$/.test(id);
}

// 检测小数
export function checkDecimal (x, size) {
  if( ~`${x}`.indexOf('.') && size) {
    return `${x}`.split('.')[1].length === size;
  } else if( size === 0 ) {
    return true;
  }
  return false;
}

// 检测手机号
export function isMobile( value ) {
  return /^\d{11,11}$/.test(value);
}

// 简易身份证检测
export function isIdentity( value ) {
  return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value);
}

/**
 * 生成指定长度的数组, 例：genArrayWithLength(3) => [0, 1, 2];
 * @param {Number} len [指定长度]
 * @return {Array} [有序数组]
 */
export function genArrayWithLength(len) {
  return Array.from({length: len}, (v, k) => k);
}

// 检测时间区间是否覆盖
export function timeRangeOverlaps( targetRange, rangeArr ) {

  const cache = {};
  function coverTimeRange( { startTime, endTime } ) {
    const key =`${startTime}~${endTime}`;
    let cached = cache[key];
    if( !cached ) {
      const startMoment = moment(startTime);
      const endMoment = moment(endTime);
      const radius = (endMoment - startMoment) / 2;
      cached = {
        mid: startMoment + radius,
        radius,
      };
      cache[key] = cached;
    }
    return cached;
  }

  const { mid, radius } = coverTimeRange(targetRange);

  return rangeArr.some( range => Math.abs(coverTimeRange(range).mid - mid) < coverTimeRange(range).radius + radius );

}

export function transformMap2Options(map) {
  return Object.keys(map).map( key => ({
    value: key,
    label: map[key],
  }) );
}
