import request from '../utils/request';

export function getPersonnel(body) {
  return request('/api/employees/customized_forms', {
    method: 'GET',
    body,
  });
}

export function deletePersonnel(id) {
  return request(`/api/employees/customized_forms/${id}`, {
    method: 'DELETE',
  });
}
export function activePersonnel(body) {
  return request(`/api/employees/customized_forms/${body.id}/toggle_active`, {
    method: 'PUT',
    body: body.request,
  });
}
export function sortPersonnel(body) {
  return request(`/api/employees/customized_forms/sort`, {
    method: 'PUT',
    body,
  });
}
