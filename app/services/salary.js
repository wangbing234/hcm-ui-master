import request from '../utils/request';

export function getSalaryList(body) {
  return request('/api/salaries/employees', {
    method: 'GET',
    body,
  });
}

export function getDetailBasic(employeeId) {
  return request(`/api/salaries/employees/${employeeId}/basic`, {
    method: 'GET',
  });
}

export function getDetailMonthly(employeeId) {
  return request(`/api/salaries/employees/${employeeId}/monthly_detail`, {
    method: 'GET',
  });
}

export function getDetailSalary(employeeId) {
  return request(`/api/salaries/employees/${employeeId}/salary_info`, {
    method: 'GET',
  });
}

export function getDetailSecurity(employeeId) {
  return request(`/api/salaries/employees/${employeeId}/security_info`, {
    method: 'GET',
  });
}

export function getDetailHistory(employeeId) {
  return request(`/api/salaries/employees/${employeeId}/history`, {
    method: 'GET',
  });
}
