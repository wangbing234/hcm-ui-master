import request from 'utils/request';

// 获取薪酬配置信息
export function getSalaryConfig() {
  return request('/api/salaries/setting/config');
}

// 设置薪酬周期
export function cycleDateSetting(body) {
  return request('/api/salaries/setting/cycle' , {
    method: 'PUT',
    body,
  });
}

// 设置发薪日期
export function payDateSetting(body) {
  return request('/api/salaries/setting/pay_date', {
    method: 'PUT',
    body,
  })
}


