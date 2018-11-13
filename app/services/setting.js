import BaseService from './BaseService';
import { CheckModel } from '../decorators/Check';
import OrgSetting from '../shcema/setting/Organization';

export class OrganizationSettingService extends BaseService {
  @CheckModel(OrgSetting)
  getCusFields() {
    return this.request('/api/organizations/customized_fields');
  }

  createCusField(data) {
    return this.request(`/api/organizations/customized_fields`, {
      method: 'POST',
      body: data,
    });
  }

  editCusField(data) {
    const { id } = data;
    return this.request(`/api/organizations/customized_fields/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  toggleActiveCusField(id) {
    return this.request(`/api/organizations/customized_fields/${id}/toggle_active`, {
      method: 'PUT',
    });
  }
}
