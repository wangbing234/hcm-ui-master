import React, { PureComponent } from 'react';
import { PERMISSION_CODE } from 'constants/permission';
import { TABLE_DEFAULT_COLUMNS } from 'constants/position';

import { actions } from 'models/position';

import withFetch from 'decorators/withFetch';
import HCMTable from 'components/HCMTable';
import Permission from 'components/Permission';
import Header from './Header';
import EditModal from './EditModal';
import DeleteConfirm from './DeleteConfirm';
import ActiveConfirm from './ActiveConfirm';

import styles from './Position.less';

const { GET_POSITIONS } = actions;

const PositionListTable = withFetch(GET_POSITIONS, state => ({
  data: state.position.positionList,
}))(HCMTable);

export default class Position extends PureComponent {
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

  openEditPosition = payload => {
    if( !payload.id || payload.enableEdit ) {
      const { updateInfoPosition } = this.props;
      let positionInfo = payload;
      if (!positionInfo || !positionInfo.id) {
        positionInfo = {};
      }
      updateInfoPosition(positionInfo);
    }
  };

  render() {
    const {
      positionInfo,
      payload,
      changeState,
      onChangePageConfig,
      onRefresh,
      updateInfoPosition,
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
        action: (rowData) => this.openEditPosition(rowData),
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
      <Permission code={PERMISSION_CODE.POSITION}>
      {hasPermission => (
      <div className={styles.position}>
        <Header onCreate={hasPermission && this.openEditPosition} changeState={changeState} {...payload} />
        <PositionListTable
          withEnableEdit
          columns={TABLE_DEFAULT_COLUMNS}
          actionPayload={payload}
          headerActions={hasPermission ? tableHeaderActions : undefined}
          itemActions={hasPermission ? tableItemActions : undefined}
          onChangePageConfig={onChangePageConfig}
          onRowClick={hasPermission ? this.openEditPosition : undefined}
        />
        <EditModal
          data={positionInfo}
          // visible={!!positionInfo}
          handleOk={() => {
            updateInfoPosition();
            onRefresh();
          }}
          handleCancel={() => updateInfoPosition()}
          onDelete={this.onDelete}
          onInvalid={this.onActive}
          active={payload.active === '1'}
        />
        <DeleteConfirm
          id={deleteId}
          onDeleted={() => {
            onRefresh();
            this.onDelete();
            updateInfoPosition();
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
            updateInfoPosition();
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
