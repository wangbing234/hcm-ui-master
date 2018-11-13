import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { connect } from 'dva';
import { Table, Menu, Dropdown } from 'antd';

import Card from 'components/Card';

import styles from './FetchTable.less';

function getItemMore(items) {
  return (...args) => (
    <Dropdown
      getPopupContainer={triggerNode => triggerNode}
      trigger={['click']}
      placement="bottomRight"
      onClick={e => e.stopPropagation()}
      overlay={
        <Menu style={{ width: 140 }} onClick={({ domEvent }) => domEvent.stopPropagation()}>
          {items.map(({ label, action }) => (
            <Menu.Item onClick={() => action(...args)}>{label}</Menu.Item>
          ))}
        </Menu>
      }
    >
      <span className="icon-more" style={{display: 'block', width: 20}} />
    </Dropdown>
  );
}

function CustomHeader(props) {
  const { headerActions, selectedRows } = props;
  return (
    <div className={styles.customHeader}>
      {headerActions.map(({ action, icon, label }) => (
        <div key={label} className={styles.headerAction} onClick={() => action(selectedRows)}>
          <span className={icon} />
          {label}
        </div>
      ))}
    </div>
  );
}

export default function withTable(modelName, getData) {
  class HCMTable extends PureComponent {
    static displayName = 'HCMTable';

    static propTypes = {
      headerActions: PropTypes.array,
      itemActions: PropTypes.array,
      onChangePageConfig: PropTypes.func,
      onRowClick: PropTypes.func,
    };

    static defaultProps = {
      headerActions: [],
      itemActions: [],
      onChangePageConfig: () => {},
      onRowClick: () => {},
    };

    constructor(props) {
      super(props);
      this.state = {
        selectedRowKeys: [],
      };
    }

    onSelectChange = selectedRowKeys => {
      this.setState({ selectedRowKeys });
    };

    render() {
      const {
        data,
        headerActions,
        itemActions,
        columns,
        onChangePageConfig,
        onRowClick,
        rowKey,
        ...rest
      } = this.props;
      const { selectedRowKeys } = this.state;

      let dataSource = [];
      const pagination = {
        // hideOnSinglePage: true,
        showQuickJumper: true,
        showSizeChanger: true,
        // totol: {},
        onChange: onChangePageConfig,
        onShowSizeChange: (current, pageSize) => {
          onChangePageConfig(1, pageSize);
        },
      };

      if (data) {
        dataSource = data.content;
        pagination.current = data.pageable.pageNumber + 1;
        pagination.total = data.totalElements;
        pagination.pageSize = data.pageable.pageSize;
      }
      const tableProps = {
        rowSelection: {
          selectedRowKeys,
          onChange: this.onSelectChange,
        },
        dataSource,
        position: pagination,
        columns,
        onRow: (record, index) => ({
          onClick: () => onRowClick && onRowClick(record, index),
        }),
      };
      if (itemActions.length) {
        tableProps.columns = columns.concat({
          key: 'operation',
          width: 54,
          render: getItemMore(itemActions),
        });
      }

      return (
        <Card
          className={classnames(styles.fetchTable, {
            [styles.selected]: selectedRowKeys.length,
          })}
        >
          <Table
            locale={
              { emptyText: (<div className={styles.tableEmptyPlaceholder}>暂无数据</div>) }
            }
            {...tableProps}
            {...rest}
          />
          <CustomHeader
            headerActions={headerActions}
            selectedRows={dataSource.filter((item, idx) => ~selectedRowKeys.indexOf(idx))}
          />
        </Card>
      );
    }
  }

  return connect(state => ({
    data: getData(state[modelName]),
    loading: state.loading.models[modelName],
  }))(HCMTable);
}
