import request from 'utils/request';

// 获取社保方案
export function getSocialSecurityPlans(){
  return request('/api/salaries/social_security_plans');
}

// 添加社保方案
export function saveSocialSecurityScheme(body){
  if(body.id){
    return request(`/api/salaries/social_security_plans/${body.id}`, {
      method: 'PUT',
      body,
    })
  }else{
    return request('/api/salaries/social_security_plans', {
      method: 'POST',
      body,
    });
  }
}

// 删除社保方案
export function deleteSocialSecurityPlan(id){
  return request(`/api/salaries/social_security_plans/${id}`, {
    method: 'DELETE',
  });
}

// 获取公积金方案
export function getHousingFundPlans(){
  return request('/api/salaries/housing_fund_plans')
}

// 更改公积金方案
export function updateProvidentFundScheme(body){
  return request(`/api/salaries/housing_fund_plans/${body.id}`, {
    method: 'PUT',
    body,
  })
}

// 删除公积金方案
export function deleteHousingFundPlan(id){
  return request(`/api/salaries/housing_fund_plans/${id}`, {
    method: 'DELETE',
  })
}

// 添加公积金方案
export function saveProvidentFundScheme(body){
  if(body.id){
    return request(`/api/salaries/housing_fund_plans/${body.id}`, {
      method: 'PUT',
      body,
    })
  }else{
    return request('/api/salaries/housing_fund_plans', {
      method: 'POST',
      body,
    })
  }

}
