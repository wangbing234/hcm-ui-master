import React, { Component } from 'react';
import classnames from 'classnames';
import { DragSource } from 'react-dnd';
import styles from './DragField.less';

const sourceSpec = {
  beginDrag(props) {
    return props;
  },

  endDrag(props, monitor) {
    const { onEndDrag } = props;
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    const { fieldType } = item.info;
    if (dropResult) {
      onEndDrag(fieldType);
    }
    return item;
  },
};

@DragSource('FIELDITEM', sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
class DragField extends Component {
  render() {
    const { isDragging, connectDragSource, info, onEndDrag } = this.props;

    return connectDragSource(
      <div
        key={info.fieldType}
        className={classnames(styles.dragField, {
          [styles.dragging]: isDragging,
        })}
      >
        <span
          className="icon-plus"
          onClick={() => {
            onEndDrag(info.fieldType);
          }}
        />
        <i className={info.icon} />
        {info.label}
      </div>
    );
  }
}

export default DragField;
