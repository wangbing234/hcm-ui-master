import request from 'utils/request';

// 获取薪资项列表
export function getSalaryList() {
  return request('/api/salaries/items');
}

// 删除薪资项
export function delSalaryItem(id) {
  return request(`/api/salaries/items/${id}`, {
    method: 'DELETE',
  });
}

// 编辑薪资项页面--获取薪资项列表包含内置
export function getSalaryOption() {
  return request('/api/salaries/items/option');
}

// 新建 && 编辑薪资项
export function createSalaryItem(data) {
  // 编辑
  if (data.id) {
    return request(`/api/salaries/items/${data.id}`, {
      method: 'PUT',
      body: data,
    });
  }
  // 新建
  return request('/api/salaries/items/', {
    method: 'POST',
    body: data,
  });
}
