import React, { PureComponent } from 'react';
import { PERMISSION_CODE } from 'constants/permission';
import { TABLE_DEFAULT_COLUMNS } from 'constants/company';
import { actions } from 'models/company';

import withFetch from 'decorators/withFetch';
import HCMTable from 'components/HCMTable';
import Permission from 'components/Permission';

import Header from './Header';
import EditModal from './EditModal';
import DeleteConfirm from './DeleteConfirm';
import ActiveConfirm from './ActiveConfirm';
import styles from './Company.less';

const { GET_COMPANIES } = actions;

const CompanyListTable = withFetch(GET_COMPANIES, state => ({
  data: state.company.companyList,
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
  openEditCompany = payload => {
    if( !payload.id || payload.enableEdit ) {
      const { updateInfoCompany } = this.props;
      let companyInfo = payload;
      if (!companyInfo || !companyInfo.id) {
        companyInfo = {};
      }
      updateInfoCompany(companyInfo);
    }
  };

  render() {
    const {
      companyInfo,
      // confirmInfo,
      payload,
      changeState,
      // onInvalid,
      // onDelete,
      onChangePageConfig,
      onRefresh,
      updateInfoCompany,
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
        action: (rowData) => this.openEditCompany(rowData),
        label: '编辑',
      },
      {
        action: ({ id }) => this.onActive([id]),
        label: payload.active === '1' ? '失效' : '生效',
      },
      {
        action: ({ id }) => this.onDelete(id),
        label: '删除',
      },
    ];
    return (
      <Permission code={PERMISSION_CODE.COMPANY}>
        {hasPermission => (
          <div className={styles.company}>
            <Header onCreate={hasPermission && this.openEditCompany} changeState={changeState} {...payload} />
            <CompanyListTable
              withEnableEdit
              columns={TABLE_DEFAULT_COLUMNS}
              actionPayload={payload}
              headerActions={hasPermission ? tableHeaderActions : undefined}
              itemActions={hasPermission ? tableItemActions : undefined}
              onChangePageConfig={onChangePageConfig}
              onRowClick={hasPermission ? this.openEditCompany : undefined}
            />
            <EditModal
              data={companyInfo}
              // visible={!!companyInfo}
              handleOk={() => {
                updateInfoCompany();
                onRefresh();
              }}
              handleCancel={() => updateInfoCompany()}
              onDelete={this.onDelete}
              onInvalid={this.onActive}
              active={payload.active === '1'}
            />
            <DeleteConfirm
              id={deleteId}
              onDeleted={() => {
                onRefresh();
                this.onDelete();
                updateInfoCompany();
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
                updateInfoCompany();
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
