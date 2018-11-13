import React, { Children, PureComponent } from 'react';

import Button from 'components/Base/Button';

import styles from './Detail.less';

function bindArg(func, arg1) {
  return () => func(arg1);
}

function InfoCardHeader(props) {
  const { id, title, onTrash, onPlus, onEdit, onCancel, onSave } = props;
  return (
    <header className={styles.cardHeader}>
      <span>{title}</span>
      <div>
        {onTrash && (
          <Button
            onClick={bindArg(onTrash, id)}
            className={`${styles.cardIcon} ${styles.cardButton}`}
          >
            <i className="icon-o-trash" />
          </Button>
        )}
        {onPlus && (
          <Button
            onClick={bindArg(onPlus, id)}
            className={`${styles.cardIcon} ${styles.cardButton}`}
          >
            <i className="icon-plus" />
          </Button>
        )}
        {onEdit && (
          <Button
            onClick={bindArg(onEdit, id)}
            className={`${styles.cardIcon} ${styles.cardButton}`}
          >
            <i className="icon-edit" />
          </Button>
        )}
        {onCancel && (
          <Button onClick={bindArg(onCancel, id)} className={styles.cardButton}>
            取消
          </Button>
        )}
        {onSave && (
          <Button type="primary" className={styles.cardButton} onClick={bindArg(onSave, id)}>
            保存
          </Button>
        )}
      </div>
    </header>
  );
}

export default class InfoCard extends PureComponent {
  onTrashByIdx = idx => () => {
    const { id, onTrash } = this.props;
    onTrash(id, idx);
  };

  render() {
    const {
      id,
      title,
      multiRecord,
      required,
      onPlus,
      onEdit,
      onTrash,
      children,
      data,
      ...otherAction
    } = this.props;
    const childrenCount = Children.count(children);
    const isPosition = id === 'position';
    let positionMaxStartDateIdx;
    if( data && isPosition ) {
      let maxStartDate;
      data.forEach( (item, idx) => {
        if( item.get('startDate') && (!maxStartDate || maxStartDate < item.get('startDate')) ) {
          maxStartDate = item.get('startDate');
          positionMaxStartDateIdx = idx;
        }
      } );
    }
    return (
      <div className={styles.card}>
        <InfoCardHeader
          id={id}
          title={title}
          onTrash={
            (!isPosition || !!positionMaxStartDateIdx) &&
            onTrash &&
            ((!required && childrenCount) || childrenCount > 1) &&
            this.onTrashByIdx(0)
          }
          onPlus={(multiRecord || !childrenCount) && onPlus}
          onEdit={!!childrenCount && onEdit}
          {...otherAction}
        />
        {children &&
          Children.map(
            children,
            (child, idx) =>
              idx === 0 ? (
                <div className={styles.cardContent}>{child}</div>
              ) : (
                <div>
                  <InfoCardHeader
                    id={id}
                    title={title}
                    onTrash={
                      (!isPosition || positionMaxStartDateIdx !== idx) &&
                      onTrash &&
                      this.onTrashByIdx(idx)}
                  />
                  <div className={styles.cardContent}>{child}</div>
                </div>
              )
          )}
      </div>
    );
  }
}
