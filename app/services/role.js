import BaseService from './BaseService';
import request from '../utils/request';

export class RoleService extends BaseService {
  // 获取角色列表
  getRolePermissionList() {
    return this.request('/api/authorization/roles');
  }

	// 新增角色
	addRole(payload) {
    const { name } = payload;
    return this.request(`/api/authorization/roles`, {
      method: 'POST',
      body: { name },
    });
  }

	// 修改角色
	editRole(payload) {
    const { id, name } = payload;
    return this.request(`/api/authorization/roles/${id}`, {
      method: 'PUT',
      body: { name },
    });
  }

	// 删除角色
	deleteRole(payload) {
    const { id } = payload;
    return this.request(`/api/authorization/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // 获取公司、部门树
  getOrgTree = () => {
    return request('/api/company/tree');
  }

  // 获取角色权限配置详细
  getRolePermissionDetail = (payload) => {
    const { id } = payload;
    return request(`/api/authorization/roles/${id}/permissions`);
  }

  // 保存角色权限配置
  saveRolePermissionDetail(payload) {
    const { id, data } = payload;
    return this.request(`/api/authorization/roles/${id}/permissions`, {
      method: 'POST',
      body: data,
    });
  }

  // 获取员工列表
  getRolesEmployees(payload) {
    return this.request('/api/authorization/employees',{
      method: 'GET',
      body: payload,
    });
  }
  // 获取员工单条列表
  getRolesEmployee(id) {
    return this.request(`/api/authorization/employees/${id}/roles`,{
      method: 'GET',
      body: id,
    });
  }
  
  // 编辑角色分配
  editRolesEmployee(payload) { 
    const { id,roleIds } = payload;
    return this.request(`/api/authorization/employees/${id}/roles`, {
      method: 'POST',
      body: roleIds,
    });
  }

   // 获取超级管理员信息
   querySuperAdmin() {
    return this.request('/api/employees/me');
  }
}
