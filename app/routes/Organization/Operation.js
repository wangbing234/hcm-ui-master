import React, { Component } from 'react';
import CompanyModal from '../Company/EditModal';
import CompanyDeleteConfirm from '../Company/DeleteConfirm';
import CompanyActiveConfirm from '../Company/ActiveConfirm';

import DepartmentModal from '../Department/EditModal';
import DepartmentDeleteConfirm from '../Department/DeleteConfirm';
import DepartmentActiveConfirm from '../Department/ActiveConfirm';

class Operation extends Component {
  state = {
    companyDeleteId: undefined,
    companyActiveIds: undefined,
    departmentDeleteId: undefined,
    departmentActiveIds: undefined,
  };

  // 编辑公司中删除公司
  handleDeleteCompany = id => {
    this.setState({ companyDeleteId: id });
  };

  // 编辑公司中将公司失效
  handleInvalidCompany = id => {
    this.setState({ companyActiveIds: typeof id === 'number' ? [id] : id });
  };
  /*-----*/

  // 编辑公司中删除公司
  handleDeleteDepartment = id => {
    this.setState({ departmentDeleteId: id });
  };

  // 编辑公司中将公司失效
  handleInvalidDepartment = id => {
    this.setState({ departmentActiveIds: id });
  };

  render() {
    const {
      companyDeleteId,
      companyActiveIds,
      departmentDeleteId,
      departmentActiveIds,
    } = this.state;

    const {
      company, // 公司信息
      department,
      getTreeData, // 获取组织架构树
      onUpdateDepartmentInfo,
      onUpdateCompanyInfo,
    } = this.props;

    return (
      <div>
        {/*  新建、编辑公司 */}
        <CompanyModal
          active
          data={company.companyInfo}
          handleOk={() => {
            onUpdateCompanyInfo();
            getTreeData();
          }}
          handleCancel={() => {
            onUpdateCompanyInfo();
          }}
          onDelete={this.handleDeleteCompany}
          onInvalid={this.handleInvalidCompany}
        />
        <CompanyDeleteConfirm
          id={companyDeleteId}
          onDeleted={() => {
            this.handleDeleteCompany();
            onUpdateCompanyInfo();
            getTreeData();
          }}
          onCancel={() => {
            this.handleDeleteCompany();
          }}
        />
        <CompanyActiveConfirm
          ids={companyActiveIds}
          isActive
          handleOk={() => {
            this.handleInvalidCompany();
            onUpdateCompanyInfo();
            getTreeData();
          }}
          onCancel={() => {
            this.handleInvalidCompany();
          }}
        />

        {/*  新建、编辑部门 */}
        <DepartmentModal
          active
          data={department.departmentInfo}
          handleOk={() => {
            onUpdateDepartmentInfo();
            getTreeData();
          }}
          handleCancel={() => {
            onUpdateDepartmentInfo();
          }}
          onDelete={this.handleDeleteDepartment}
          onInvalid={this.handleInvalidDepartment}
        />
        <DepartmentDeleteConfirm
          id={departmentDeleteId}
          onDeleted={() => {
            this.handleDeleteDepartment();
            onUpdateDepartmentInfo();
            getTreeData();
          }}
          onCancel={() => {
            this.handleDeleteDepartment();
          }}
        />
        <DepartmentActiveConfirm
          ids={departmentActiveIds}
          isActive
          handleOk={() => {
            this.handleInvalidDepartment();
            onUpdateDepartmentInfo();
            getTreeData();
          }}
          onCancel={() => {
            this.handleInvalidDepartment();
          }}
        />
      </div>
    );
  }
}

export default Operation;
