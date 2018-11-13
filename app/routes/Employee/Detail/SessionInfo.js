import React, { PureComponent } from 'react';

import classnames from 'classnames';

import StandardInfoCard from './StandardInfoCard';

import styles from './Detail.less';

export function Session({ title, children, className }) {
  return (
    <div className={classnames(styles.session, { [className]: className })}>
      <header className={styles.sessionHeader}>{title}</header>
      {children}
    </div>
  );
}
export default class SessionInfo extends PureComponent {
  render() {
    const { title, config, data, error, onChange, onPlusForm, onTrashForm } = this.props;
    return (
      <Session title={title}>
        {config.map(({ id, ...cardProps }) => (
          <StandardInfoCard
            key={id}
            id={id}
            onPlus={onPlusForm}
            onTrash={onTrashForm}
            data={data.get(`${id}`) || {}}
            error={(error || {})[id]}
            onChange={onChange}
            {...cardProps}
          />
        ))}
      </Session>
    );
  }
}
