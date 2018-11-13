import React, { PureComponent } from 'react';

import { TABLE_DEFAULT_COLUMNS } from 'constants/grade';
import { PERMISSION_CODE } from 'constants/permission';
import Permission from 'components/Permission';

import { actions } from 'models/grade';
import withFetch from 'decorators/withFetch';
import HCMTable from 'components/HCMTable';

import Header from './Header';
import EditModal from './EditModal';
import DeleteConfirm from './DeleteConfirm';
import ActiveConfirm from './ActiveConfirm';

import styles from './grade.less';

const { GET_GRADES } = actions;

const CompanyListTable = withFetch(GET_GRADES, state => ({
  data: state.grade.gradeList,
}))(HCMTable);

export default class Grade extends PureComponent {
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

  openEditGrade = payload => {
    const { updateInfoGrade } = this.props;
    let gradeInfo = payload;
    if (!gradeInfo || !gradeInfo.id) {
      gradeInfo = {};
    }
    updateInfoGrade(gradeInfo);
  };

  render() {
    const {
      gradeInfo,
      // confirmInfo,
      payload,
      changeState,
      // onInvalid,
      // onDelete,
      onChangePageConfig,
      onRefresh,
      updateInfoGrade,
    } = this.props;
    const { deleteId, activeIds, clearRowkeys } = this.state;
    const tableHeaderActions = [
      {
        action: (items, keys) => {
          this.onActive(items.map(item => item.id));
          this.setState({clearRowkeys: keys})
        },
        icon: 'icon-disable',
        label: payload.active === '1' ? '批量失效' : '批量生效',
      },
    ];

    const tableItemActions = [
      {
        action: (rowData) => this.openEditGrade(rowData),
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
      <Permission code={PERMISSION_CODE.GRADE}>
      {hasPermission => (
      <div className={styles.company}>
        <Header onCreate={hasPermission&&this.openEditGrade} changeState={changeState} {...payload} />
        <CompanyListTable
          columns={TABLE_DEFAULT_COLUMNS}
          actionPayload={payload}
          headerActions={hasPermission?tableHeaderActions:undefined}
          itemActions={hasPermission?tableItemActions:undefined}
          onChangePageConfig={onChangePageConfig}
          onRowClick={hasPermission?this.openEditGrade:undefined}
        />
        <EditModal
          data={gradeInfo}
          visible={!!gradeInfo}
          handleOk={() => {
            updateInfoGrade();
            onRefresh();
          }}
          handleCancel={() => updateInfoGrade()}
          onDelete={this.onDelete}
          onInvalid={this.onActive}
          active={payload.active === '1'}
        />
        <DeleteConfirm
          id={deleteId}
          onDeleted={() => {
            onRefresh();
            this.onDelete();
          }}
          clearRowkeys={clearRowkeys}
          onCancel={() => {
            this.onDelete();
          }}
          updateInfoGrade={updateInfoGrade}
        />
        <ActiveConfirm
          ids={activeIds}
          isActive={payload.active === '1'}
          updateInfoGrade={updateInfoGrade}
          handleOk={() => {
            onRefresh();
            this.onActive();
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
