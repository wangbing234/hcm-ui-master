import request from '../utils/request';

export function getGrades(body) {
  return request('/api/grade', {
    method: 'GET',
    body,
  });
}

export function getGrade(companyId) {
  return request(`/api/grade/${companyId}`, {
    method: 'GET',
  });
}

export function createGrade(body) {
  return request('/api/grade', {
    method: 'POST',
    body,
  });
}

export function updateGrade(body) {
  return request(`/api/grade/${body.id}`, {
    method: 'PUT',
    body,
  });
}

export function deleteGrade(positionID) {
  return request(`/api/grade/${positionID}`, {
    method: 'DELETE',
  });
}

export function inactiveGrade(body) {
  return request(`/api/grade/enable`, {
    method: 'PUT',
    body,
  });
}
