import request from '../utils/request';

export function getPositions(body) {
  return request('/api/position', {
    method: 'GET',
    body,
  });
}

export function getPosition(positionId) {
  return request(`/api/position/${positionId}`, {
    method: 'GET',
  });
}

export function createPosition(body) {
  return request('/api/position', {
    method: 'POST',
    body,
  });
}

export function updatePosition(body) {
  return request(`/api/position/${body.id}`, {
    method: 'PUT',
    body,
  });
}

export function deletePosition(positionId) {
  return request(`/api/position/${positionId}`, {
    method: 'DELETE',
  });
}

export function inactivePosition(body) {
  return request(`/api/position/enable`, {
    method: 'PUT',
    body,
  });
}

export function getPositionTree() {
  return request(`/api/company/tree/selection`, {
    method: 'GET',
  });
}
