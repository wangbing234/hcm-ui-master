import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { Table, Menu, Dropdown } from 'antd';

import Card from 'components/Card';

import styles from './HCMTable.less';

function getItemMore(items, withEnableEdit) {
  return (...args) => (
    <Dropdown
      disabled={withEnableEdit && !args[0].enableEdit}
      getPopupContainer={triggerNode => triggerNode}
      trigger={['click']}
      placement="bottomRight"
      onClick={e => e.stopPropagation()}
      overlay={
        <Menu style={{ width: 140 }} onClick={({ domEvent }) => domEvent.stopPropagation()}>
          {items.map(({ label, action }, index) => {
            const key = index;
            return (
              <Menu.Item key={key} onClick={() => action(...args)}>{label}</Menu.Item>
            )
          })}
        </Menu>
      }
    >
      <span className="icon-more" style={{display: 'block', width: 20}} />
    </Dropdown>
  );
}

function CustomHeader(props) {
  const { headerActions, selectedRows, clearRowKey } = props;
  return (
    <div className={styles.customHeader}>
      {headerActions.map(({ action, icon, label }) => (
        <div key={label} className={styles.headerAction} onClick={() => action(selectedRows, clearRowKey)}>
          <span className={icon} />
          {label}
        </div>
      ))}
    </div>
  );
}

export default class HCMTable extends PureComponent {
  static displayName = 'HCMTable';

  static propTypes = {
    headerActions: PropTypes.array,
    itemActions: PropTypes.array,
    onChangePageConfig: PropTypes.func,
    onRowClick: PropTypes.func,
    withEnableEdit: PropTypes.func,
  };

  static defaultProps = {
    headerActions: [],
    itemActions: [],
    onChangePageConfig: () => {},
    onRowClick: () => {},
    withEnableEdit: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidUpdate() {
    const { data, onChangePageConfig } = this.props;
    if( data ) {
      const { pageable, totalElements } = data;
      const { pageNumber, pageSize } = pageable;
      const current = pageNumber;
      if( current > 1 && totalElements / pageSize <= current  ) {
        onChangePageConfig(current, pageSize);
      }
    }
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  clearRowKey = () => {
    this.setState({selectedRowKeys: []})
  }

  render() {
    const {
      data,
      headerActions,
      itemActions,
      columns,
      onChangePageConfig,
      onRowClick,
      withEnableEdit,
      ...rest
    } = this.props;
    const { selectedRowKeys } = this.state;

    let dataSource = [];
    const pagination = {
      // hideOnSinglePage: true,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: onChangePageConfig,
      onShowSizeChange: (current, pageSize) => {
        onChangePageConfig(1, pageSize);
      },
      position: 'bottom',
    };

    if (data) {
      dataSource = data.content;
      pagination.current = data.pageable.pageNumber + 1;
      pagination.total = data.totalElements;
      pagination.pageSize = data.pageable.pageSize;

      // if( pagination.total / pagination.pageSize < pagination.current  ) {
      //   pagination.total = pagination.pageSize * pagination.current;
      // }
    }

    const tableProps = {
      rowSelection: headerActions && headerActions.length && {
        selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: ({enableEdit}) => ({disabled: withEnableEdit && !enableEdit}),
      },
      dataSource,
      pagination,
      columns,
      onRow: (record, index) => ({
        onClick: () => onRowClick && onRowClick(record, index),
      }),
    };
    if (itemActions.length) {
      tableProps.columns = columns.concat({
        key: 'operation',
        width: 54,
        render: getItemMore(itemActions, withEnableEdit),
      });
    }

    return (
      <Card
        className={classnames(styles.HCMTable, {
          [styles.selected]: selectedRowKeys.length,
        })}
      >
        <Table
          locale={
            { emptyText: (<div className={styles.tableEmptyPlaceholder}>暂无数据</div>) }
          }
          rowKey="id"
          {...tableProps}
          {...rest}
        />
        {headerActions && headerActions.length > 0 ? (
          <CustomHeader
            clearRowKey={this.clearRowKey}
            headerActions={headerActions}
            selectedRows={dataSource.filter(({id}) => ~selectedRowKeys.indexOf(id))}
          />
        ) : null}
      </Card>
    );
  }
}
