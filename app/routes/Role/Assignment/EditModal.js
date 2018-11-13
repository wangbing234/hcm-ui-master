import React, { Component } from 'react';
import { connect } from 'dva';
import { createPromiseDispatch } from 'utils/actionUtil';
import { Input, Modal, Button,Select } from 'components/Base';
import FormBox from 'components/FormBox';
import { actions } from 'models/rolePermission';
import { actions as assignmentActions } from 'models/roleAssignment';
import { Layout, Row, Column } from 'layouts/FormLayout';

const { GET_ROLE_PERMISSION_LIST } = actions;
const { EDIT_EMPLOYEE,UPDATE_EMPLOYEE_INFO,CLEAR_EMPLOYEE } = assignmentActions;

@connect(({ rolePermission = {} , loading }) => ({
  loading: loading.models.rolePermission,
  rolePermissionList: rolePermission.rolePermissionList,
}))
export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleIds: [],
    };
    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.updateEmployee = payload => {this.dispatch(UPDATE_EMPLOYEE_INFO, payload);}
  }

  componentDidMount() {
    const { dispatch, rolePermissionList } = this.props;
    if (!rolePermissionList) {
      GET_ROLE_PERMISSION_LIST(dispatch, { payload: null });
    }
  }

  clearEmployee () {
    const { dispatch } = this.props;
    CLEAR_EMPLOYEE(dispatch, { payload: null });
  }

  promiseDispatch = createPromiseDispatch();

  multipleChange = (value) => {
    const { rolesEmployee } = this.props;
    const val = value.map( item => {
     return  {"id" : item}
    }
      )
    this.updateEmployee({
      ...rolesEmployee,
      roles: val ,
    });

  }


  handleOk = () => {
    const { onSave, id } = this.props;
    this.promiseDispatch(EDIT_EMPLOYEE, {
      id,
      roleIds: this.state.roleIds,
    }).then(() => {
      onSave();
    });
  };

  renderName() {
    const { rolesEmployee } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox label="姓名" isRequired>
            <Input
              style={{ width: '100%' }}
              disabled
              value={
                rolesEmployee
                  ? `${rolesEmployee.departmentName} | ${
                      rolesEmployee.employeeName
                    }`
                  : null
              }
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderTel() {
    const { rolesEmployee } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox label="手机" isRequired>
            <Input
              style={{ width: '100%' }}
              disabled
              value={rolesEmployee ? rolesEmployee.mobile : null}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderRoleAssignments() {
    const { rolePermissionList, rolesEmployee } = this.props;
    const rolesEmployeeValues = rolesEmployee
    ? rolesEmployee.roles.map(item => item.id)
    : [];
    const values = rolesEmployeeValues.filter(value => { return value})
     return (
      <Row cols={1}>
        <Column>
          <FormBox label="角色权限" isRequired>
            <Select
              mode="multiple"
              placeholder="请选择"
              value={values}
              onChange={ (value) => {
                this.multipleChange(value)
                this.setState({
                  roleIds: value,
                });
              }}
            >
              {rolePermissionList
                ? rolePermissionList.map(item => {
                    return (
                      // eslint-disable-next-line
                      <Select.Option
                        value={item.get('id')}
                        key={item.get('id')}
                      >
                        {item.get('name')}
                      </Select.Option>
                    );
                  })
                : null}
            </Select>
          </FormBox>
        </Column>
      </Row>
    );
  }

  // }
  render() {
    const { visible, onCancel } = this.props;

    const footer = (
      <div>
        <Button key="back" onClick={() => {
          onCancel();
          this.clearEmployee();
        }}>
          取消
        </Button>
        <Button key="submit" type="primary" onClick={this.handleOk}>
          确认
        </Button>
      </div>
    );

    return (
      <Modal
        small
        onCancel={() => {
          onCancel();
          this.clearEmployee()
        }}
        zIndex={1}
        visible={visible}
        title="编辑角色分配"
        footer={footer}
      >
        <Layout>
          {this.renderName()}
          {this.renderTel()}
          {this.renderRoleAssignments()}
        </Layout>
      </Modal>
    );
  }
}
