import BaseService from './BaseService';
// import { CheckModel } from '../decorators/Check';
// import Department from '../shcema/Department';

export default class DeptService extends BaseService {
  // @CheckModel(Department)
  // 获取部门列表
  getDepartments(body) {
    return this.request('/api/department', {
      method: 'GET',
      body,
    });
  }

  getDepartment(id) {
    return this.request(`/api/department/${id}`, {
      method: 'GET',
    });
  }

  // 创建/编辑部门
  saveDepartment(body) {
    if(body.id){
      return this.request(`/api/department/${body.id}`, {
        method: 'PUT',
        body,
      });
    }else{
      return this.request('/api/department', {
        method: 'POST',
        body,
      });
    }

  }

  // 获取公司列表
  getCompanyTree(body) {
    return this.request('/api/company/tree/selection', {
      method: 'GET',
      body,
    });
  }

  // 删除部门
  deleteDepartment(id) {
    return this.request(`/api/department/${id}`, {
      method: 'DELETE',
    });
  }

  // 失效部门
  invalidDepartment(body) {
    return this.request(`/api/department/enable`, {
      method: 'PUT',
      body,
    });
  }

  getOrgCusFields() {
    return this.request('/api/organizations/customized_fields', {
      method: 'GET',
    });
  }
}
