import BaseService from './BaseService';
import request from '../utils/request';
// import { CheckModel } from '../decorators/Check';
// import { EmployeeHistory, EmployeeResignation } from '../shcema/Employee';

export class EmployeeService extends BaseService {
  // 获取员工列表
  getEmployees(data) {
    return (request || this.request)(`/api/employees`, {
      method: 'GET',
      body: data,
    });
  }

  // @CheckModel(EmployeeHistory)
  getEmployeeHistory(id) {
    return (request || this.request)(`/api/employees/${id}/history`);
  }

  // @CheckModel(EmployeeResignation)
  getEmployeeResignation(id) {
    return (request || this.request)(`/api/employees/${id}/resignation`);
  }

  downloadFile(payload) {
    const {fileId, fileName} = payload;
    return (request || this.request)(`/api/file/download/${fileId}`, {
      type: 'DOWNLOAD',
      fileName,
    });
  }

  getEmployeeLayout() {
    return (request || this.request)('/api/employees/customized_forms/layout');
  }

  getEmployeeDetail(id) {
    return (request || this.request)(`/api/employees/${id}`);
  }

  // 员工转正
  saveEmployeeQualify(payload) {
    const { id, data } = payload;
    return (request || this.request)(`/api/employees/${id}/qualify`, {
      method: 'PUT',
      body: data,
    });
  }

  // 获取公司列表
  getCompanyTree() {
    // /api/company/companyTree
    return (request || this.request)('/api/company/tree');
  }

  // 获取岗位列表
  getPositionList(payload) {
    const { id } = payload;
    return (request || this.request)(`/api/department/${id}/positions`);
  }

  // 获取所有员工列表
  getEmployeeMenus() {
    return (request || this.request)(`/api/employees/option`);
  }

  // 员工调岗
  saveEmployeeTransfer(payload) {
    const { id, data } = payload;
    return (request || this.request)(`/api/employees/${id}/transfer`, {
      method: 'PUT',
      body: data,
    });
  }

  // 员工离职
  saveEmployeeResignation(payload) {
    const { id, data } = payload;
    return (request || this.request)(`/api/employees/${id}/resignation`, {
      method: 'PUT',
      body: data,
    });
  }

  // 员工入职
  entryEmployee(payload) {
    return (request || this.request)(`/api/employees`, {
      method: 'POST',
      body: payload,
    });
  }

  // 员工更新
  updateEmployee(payload) {
    const { id, type, data } = payload;
    return (request || this.request)(`/api/employees/${id}/${type}`, {
      method: 'PUT',
      body: data,
    });
  }
}
