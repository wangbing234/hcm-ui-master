import request from 'utils/request';

// 获取免税额列表
export function getTaxList() {
  return request('/api/salaries/setting/threshold');
}
// 修改免税额
export function editTax(payload) {
  const { id,point } = payload;
  return request(`/api/salaries/setting/threshold/${id}`, {
    method: 'PUT',
    body: {point},
  });
}

