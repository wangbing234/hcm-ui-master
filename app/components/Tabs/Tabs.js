import React from 'react';

import classnames from 'classnames';

import styles from './Tabs.less';

export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <ul
      className={classnames(styles.tabs, {
        [className]: className,
      })}
    >
      {tabs.map( tab => {
        let { key, title } = tab;
        if( typeof tab === 'string' ) {
          key = tab;
          title = tab;
        }
        return (
          <li
            key={key}
            onClick={() => {
              onChange(key);
            }}
            className={classnames(styles.tab, {
              [styles.active]: value === key,
            })}
          >
            {title}
          </li>
        )
      })}
    </ul>
  );
}
