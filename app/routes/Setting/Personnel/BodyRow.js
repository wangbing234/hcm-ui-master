import React from 'react';
// import EmptyPlaceholder from 'components/Biz/EmptyPlaceholder';
import classnames from 'classnames';
import styles from './personnel.less';

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

export default class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      canDrop,
      isDragging,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;

    let { className } = restProps;
    const { children } = restProps;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }
    // const isActive = canDrop && isOver;
    return connectDragPreview(
      
      <tr
        {...restProps}
        className={classnames(className, {[styles.dragging]:isDragging})}
      > 
       
        {
          children.map((child, index) => {
            if ( index !== 0) {
              return child;
            } else {
              return connectDragSource(connectDropTarget(
                <div key={restProps.index} className={styles.icon}>
                  {children[0]}
                </div>
                
              ))
            }
          })
          
        }
      </tr>

      
    );
  }
}
