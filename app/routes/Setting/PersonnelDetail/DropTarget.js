import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import EmptyPlaceholder from 'components/Biz/EmptyPlaceholder';
import DropTargetItem from './DropTargetItem';
import styles from './DropTarget.less';

const targetSpec = {
  drop(props, monitor) {
    return monitor.getItem();
  },
};

@DropTarget('FIELDITEM', targetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
class DropArea extends Component {
  static propTypes = {
    onDeleteField: PropTypes.func.isRequired, // 删除字段方法
    onSelectField: PropTypes.func.isRequired, // 选中字段方法
    onSwapField: PropTypes.func.isRequired, // 交换字段方法
    fields: PropTypes.object.isRequired, // 所有字段数据
  };

  render() {
    const {
      connectDropTarget,
      isOver,
      canDrop,

      fields, // 传过来的字段数据
      onSelectField,
      onDeleteField,
      onSwapField,
    } = this.props;
    const isActive = canDrop && isOver;

    return connectDropTarget(
      <div
        className={classnames(styles.body, {
          [styles.dropActive]: isActive,
        })}
      >
        {fields && fields.size ? (
          <div className={styles.dropzone}>
            {fields.map((field, index) => {
              const key = field.get('uid') || field.get('id');
              return (
                <DropTargetItem
                  key={key}
                  total={fields.size}
                  index={index}
                  field={field}
                  onSelectField={onSelectField}
                  onDeleteField={onDeleteField}
                  onSwapField={onSwapField}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <EmptyPlaceholder size={97} placeholder="请选择表单控件" />
          </div>
        )}
        {isActive && <div className={styles.activePlaceholder} />}
      </div>
    );
  }
}

export default DropArea;
