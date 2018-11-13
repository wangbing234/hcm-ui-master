import React, { PureComponent } from 'react';
import { Table, Icon } from 'antd';
import { Link } from 'dva/router';
import Switch from 'components/Base/Switch';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// import DragItem from './DragItem';
import styles from './personnel.less';
import BodyRow from './BodyRow';

// import { DragSource, ConnectDragPreview, ConnectDragSource } from 'react-dnd'
// import {
// 	DragSource,
// 	DropTarget,
// 	ConnectDropTarget,
// 	ConnectDragSource,
// 	DropTargetMonitor,
// 	DropTargetConnector,
// 	DragSourceConnector,
// 	DragSourceMonitor,
// } from 'react-dnd';
// import { findDOMNode } from 'react-dom';

const rowSource = {
  beginDrag(props) {
    const { index } = props;
    return {
      index,
    };
  },
};

const rowTarget = {
  drop(props, _monitor) {
    const monitor = _monitor;
    const { index, moveRow } = props;
    const dragIndex = monitor.getItem().index;
    const hoverIndex = index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

function getItemMore(items) {
  return (data, ...args) => (
    <div>
      {items.map(({ action, icon }) => {
        if (icon === 'icon-menu-1') {
          return <i className={icon} />;
          // return <DragItem icon={icon} />
        } else if (icon === 'edit') {
          return (
            <Link to={`/setting/personnel/customField/${data.id}`}>
              <Icon type={icon} className={styles.menu}/>
            </Link>
          );
        }else if(icon === 'delete'){
          if(data.deletable){
          return <Icon type={icon} onClick={() => action(...args)} className={styles.delete} />
          }
          else{
            return<Icon type={icon} style={{color:'grey'}} className={styles.undelete} />
          }
      }

        else {
          return <Icon type={icon} onClick={() => action(...args)} className={icon} />;
        }
      })}
    </div>
  );
}
function getItem(items) {
  return record => (
    <div>
      {items.map(({ action }) => (
        <Switch color="success" defaultChecked={record.enable} checked={record.enable} disabled={!record.switchable} onChange={() => action(record)} />
      ))}
    </div>
  );
}
// @DropTarget('row', rowTarget, (connect) => ({
// 	connectDropTarget: connect.dropTarget(),
// }))
// @DragSource(
// 	'row',
// 	rowSource,
// 	(connect, monitor) => ({
// 		connectDragSource: connect.dragSource(),
// 		isDragging: monitor.isDragging(),
// 	}),
// )
// @DragSource('Row', rowSource, (connect, monitor) => ({
// 	connectDragSource: connect.dragSource(),
// 	connectDragPreview: connect.dragPreview(),
// 	isDragging: monitor.isDragging(),
// }))
class PersonnelTable extends PureComponent {
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data, handdleMove } = this.props;
    // const dragRow = data[dragIndex];
    handdleMove(dragIndex, hoverIndex, data);
  };

  render() {
    const { data, columns, itemActions, frontItemActions, switchActions } = this.props;
    let dataSource = [];
    // let temp = '';
    let column = [
      {
        title: '',
        render: getItemMore(frontItemActions),
      },
    ];

    if (data) {
      dataSource = data;
      // temp = title === '基本信息' ? 'basic' : title === '岗位信息' ? 'position' : 'other';
    }
    const tableProps = {
      dataSource,
      columns,
    };
    if (itemActions.length) {
      column = column.concat(tableProps.columns).concat([
        {
          title: '开启状态',
          render: getItem(switchActions),
        },

        {
          title: '    ',
          render: getItemMore(itemActions),
        },
      ]);
    }
    tableProps.columns = column;
    return (
      <div className={styles.personnel__personnel___3Bteb}>
        <Table
          className={styles.PersonnelTable}
          {...tableProps}
          pagination={false}
          rowKey={(record) =>
            record.id
          }
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(PersonnelTable);
