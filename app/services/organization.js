import BaseService from './BaseService';

export default class OrganizationService extends BaseService {
  getTreeData() {
    return this.request('/api/company/tree');
  }
}
