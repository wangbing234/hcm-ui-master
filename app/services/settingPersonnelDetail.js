import request from 'utils/request';

// 获取数据
export function getCustomizedForms(id) {
  return request(`/api/employees/customized_forms/${id}`, {
    method: 'GET',
  });
}

// 新建表单
export function submitCustomizedForms(body) {
  return request('/api/employees/customized_forms/', {
    method: 'POST',
    body,
  });
}

// 编辑表单
export function editCustomizedForms(payload) {
  const { id, body } = payload;
  return request(`/api/employees/customized_forms/${id}`, {
    method: 'PUT',
    body,
  });
}
