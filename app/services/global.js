import BaseService from './BaseService';

export default class GlobalService extends BaseService {
  // 获取员工相关信息
  queryUser() {
    return this.request('/api/employees/me');
  }

  // 获取菜单
  queryMenus() {
    return this.request('/api/menus');
  }

  // 获取当前用户权限配置
  queryUserPermission() {
    return this.request(`/api/employees/me/permission`);
  }
}
