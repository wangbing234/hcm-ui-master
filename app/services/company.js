import request from '../utils/request';

export function getCompanies(body) {
  return request('/api/company', {
    method: 'GET',
    body,
  });
}

export function getCompany(companyId) {
  return request(`/api/company/${companyId}`, {
    method: 'GET',
  });
}

export function createCompany(body) {
  return request('/api/company', {
    method: 'POST',
    body,
  });
}

export function updateCompany(body) {
  return request(`/api/company/${body.id}`, {
    method: 'PUT',
    body,
  });
}

export function deleteCompany(companyId) {
  return request(`/api/company/${companyId}`, {
    method: 'DELETE',
  });
}

export function inactiveCompany(body) {
  return request(`/api/company/enable`, {
    method: 'PUT',
    body,
  });
}

export function getCompanyTree() {
  return request(`/api/company/companyTree`, {
    method: 'GET',
  });
}
