import React, { PureComponent } from 'react';

import { TABLE_DEFAULT_COLUMNS } from 'constants/department';
import Permission from 'components/Permission';
import { actions } from 'models/department';
import { PERMISSION_CODE } from 'constants/permission';
import withFetch from 'decorators/withFetch';
import HCMTable from 'components/HCMTable';
import Header from './Header';
import EditModal from './EditModal';
import DeleteConfirm from './DeleteConfirm';
import ActiveConfirm from './ActiveConfirm';

import styles from './Department.less';

const { GET_DEPARTMENTS } = actions;

const DepartmentListTable = withFetch(GET_DEPARTMENTS, state => ({
  data: state.department.departmentList,
}))(HCMTable);

export default class Company extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      deleteId: undefined,
      activeIds: undefined,
      clearRowkeys: undefined,
    };
  }

  onDelete = id => {
    this.setState({
      deleteId: id,
    });
  };

  onActive = ids => {
    this.setState({
      activeIds: ids,
    });
  };

  getProp(name) {
    const { [name]: prop } = this.props;
    return prop;
  }

  // 单击行时触发编辑
  openEditDepartment = payload => {
    if( !payload.id || payload.enableEdit ) {
      const { updateDepartmentInfo } = this.props;
      let departmentInfo = payload;
      if (!departmentInfo || !departmentInfo.id) {
        departmentInfo = {};
      }
      updateDepartmentInfo(departmentInfo);
    }
  };

  render() {
    const {
      departmentInfo,
      payload,
      changeState,
      onChangePageConfig,
      onRefresh,
      updateDepartmentInfo,
    } = this.props;
    const { deleteId, activeIds, clearRowkeys } = this.state;
    const tableHeaderActions = [
      {
        action: (items, keys) => {
          this.onActive(items.map(item => item.id));
          this.setState({clearRowkeys: keys})
        },
        icon: 'icon-disable',
        label: payload.active === '1' ? '批量失效' : '批量有效',
      },
    ];

    const tableItemActions = [
      {
        action: (rowData) => this.openEditDepartment(rowData),
        label: '编辑',
      },
      {
        action: ({ id }) => this.onActive(id),
        label: payload.active === '1' ? '失效' : '生效',
      },
      {
        action: ({ id }) => this.onDelete(id),
        label: '删除',
      },
    ];
    return (
      <Permission code={PERMISSION_CODE.DEPARTMENT}>
        {hasPermission => (
          <div className={styles.company}>
            <Header onCreate={ hasPermission && this.openEditDepartment} changeState={changeState} {...payload} />
            <DepartmentListTable
              withEnableEdit
              columns={TABLE_DEFAULT_COLUMNS}
              actionPayload={payload}
              headerActions={hasPermission ? tableHeaderActions : undefined}
              itemActions={hasPermission ? tableItemActions : undefined}
              onChangePageConfig={onChangePageConfig}
              onRowClick={hasPermission ? this.openEditDepartment : undefined}
            />
            <EditModal
              data={departmentInfo}
              // visible={!!companyInfo}
              handleOk={() => {
                updateDepartmentInfo();
                onRefresh();
              }}
              handleCancel={() => updateDepartmentInfo()}
              onDelete={this.onDelete}
              onInvalid={this.onActive}
              active={payload.active === '1'}
            />
            <DeleteConfirm
              id={deleteId}
              onDeleted={() => {
                onRefresh();
                this.onDelete();
                updateDepartmentInfo();
              }}
              clearRowkeys={clearRowkeys}
              onCancel={() => {
                this.onDelete();
              }}
            />
            <ActiveConfirm
              ids={activeIds}
              isActive={payload.active === '1'}
              handleOk={() => {
                onRefresh();
                this.onActive();
                updateDepartmentInfo();
              }}
              clearRowkeys={clearRowkeys}
              onCancel={() => {
                this.onActive();
              }}
            />
          </div>
        )}
      </Permission>
    );
  }
}
