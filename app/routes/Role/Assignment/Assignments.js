import React, { PureComponent } from 'react';
import HCMTable from 'components/HCMTable';
import { connect } from 'dva';
import { TABLE_DEFAULT_COLUMNS } from 'constants/assignment';
import { actions } from 'models/roleAssignment';

import withFetch from 'decorators/withFetch';
import Header from './Header';

import styles from './Assignment.less';
import EditModal from './EditModal';

const { GET_ROLE_EMPLOYEE, GET_ROLE_EMPLOYEES } = actions;

const EmployeeRolesTable = withFetch(GET_ROLE_EMPLOYEES, state => ({
    data: state.roleAssignment.rolesEmployees,
}))(HCMTable);

@connect(({ roleAssignment = {}, loading }) => ({
  rolesEmployee: roleAssignment.rolesEmployee,
  loading: loading.models.roleAssignment,
}))
export default class Assignments extends PureComponent {
  state = {
    detailId: undefined,
    visible: false,
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      detailId: undefined,
    });
  };

  render() {
    const { payload, changeState, onRefresh, onChangePageConfig, dispatch, rolesEmployees, rolesEmployee } = this.props;
    const { visible, detailId } = this.state;

    const tableItemActions = [
      {
        action: ({ id }) => {
          this.setState({
            visible: true,
            detailId: id,
          });
          GET_ROLE_EMPLOYEE(dispatch, { payload: id });
        },
        label: '编辑',
      },
    ];
    if (rolesEmployees) {
      /* eslint no-param-reassign: "error" */
      rolesEmployees.content.forEach(item => {
        item.key = item.id;
        const assignArray = [];
        item.roles.forEach(key => {
          assignArray.push(key.name);
        });
        item.assignmentName = assignArray.join('、');
      });
    }
    return (
      <div className={styles.assignments}>
        <Header changeState={changeState} {...payload} />
        <div className={styles.table_Body}>
        <EmployeeRolesTable
          actionPayload={payload}
          onChangePageConfig={onChangePageConfig}
          rowSelection={undefined}
          columns={TABLE_DEFAULT_COLUMNS}
          data={rolesEmployees}
          itemActions={tableItemActions}
        />
        </div>
        <EditModal
          id={detailId}
          rolesEmployee={rolesEmployee}
          rolesEmployees={rolesEmployees}
          visible={visible}
          onSave={() => {
            onRefresh();
            this.handleOk();
          }}
          onCancel={() => {
            this.handleCancel();
          }}
        />
      </div>
    );
  }
}
