import request from '../utils/request';

export function getEmployees(data) {
  return request('/api/authorization/employees', {
    method: 'GET',
    body: data,
  });
}
