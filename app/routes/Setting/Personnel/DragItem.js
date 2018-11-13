import * as React from 'react';
import { DragSource } from 'react-dnd';

const boxSource = {
  beginDrag() {
    return {};
  },
};

@DragSource('row', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class DragItem extends React.Component {
  render() {
    const { connectDragSource, icon } = this.props;

    return connectDragSource(connectDragSource(<i className={icon} />));
  }
}
