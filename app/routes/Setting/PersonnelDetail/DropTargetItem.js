import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon } from 'antd';
import FieldView from './filedsView.js';
import styles from './DropTargetItem.less';

const sourceSpec = {
  beginDrag(props) {
    const { field, index } = props;
    return {
      field,
      index,
    };
  },
};

const targetSpec = {
  hover(props, _monitor, component) {
    const { index, onSwapField } = props;
    const monitor = _monitor;
    const dragIndex = monitor.getItem().index;
    const hoverIndex = index;

    if (dragIndex === hoverIndex) return;

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // 交换
    onSwapField(null, dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  },
};

@DropTarget('CARD', targetSpec, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('CARD', sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class DropTargetItem extends Component {

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,

      total,
      index,
      field,
      style,

      onSelectField,
      onDeleteField,
      onSwapField,
    } = this.props;

    return connectDragSource(
      connectDropTarget(
        <div
          onClick={() => {
            onSelectField(index);
          }}
          style={{ ...style }}
          className={classnames(styles.dropItem, {
            [styles.selected]: field.get('selected'),
            [styles.dragging]: isDragging,
          })}
        >
          <FieldView key={Math.random()} usefor="drag" field={field} />
          <div className={styles.dropItemAction}>
            <i
              className="icon-o-trash"
              onClick={e => {
                onDeleteField(e, index);
              }}
            />
            {index === 0 ? (
              <Icon type="arrow-up" className={styles.iconDisabled} />
            ) : (
              <Icon
                type="arrow-up"
                onClick={e => {
                  onSwapField(e, index, index - 1);
                }}
              />
            )}
            {index === total - 1 ? (
              <Icon type="arrow-down" className={styles.iconDisabled} />
            ) : (
              <Icon
                type="arrow-down"
                onClick={e => {
                  onSwapField(e, index, index + 1);
                }}
              />
            )}
          </div>
        </div>
      )
    );
  }
}

export default DropTargetItem;
