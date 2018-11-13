import React, { PureComponent } from 'react';

import withFetch from 'decorators/withFetch';

import { actions } from 'models/salary';

import styles from './Detail.less';

const {
  GET_DETAIL_HISTORY,
} = actions;

@withFetch(GET_DETAIL_HISTORY, ({salary}) => ({
  data: salary.detailHistory,
}))
export default class SecurityInfo extends PureComponent {

  render() {
    const { data } = this.props;
    if( !data ) {
      return null;
    }
    return (
      <div className={styles.history}>
        <header className={styles.historyHeader}>调薪记录</header>
        <ul className={styles.historyList}>
          {data.map( ({adjustDate, afterAdjust, beforeAdjust, increased}) => (
<li className={styles.historyItem}>
            <header className={styles.itemHeader}>
              <span className={styles.itemTitle}>基本工资</span>
              <span>{adjustDate}</span>
            </header>
            <span>{`${afterAdjust}元至${beforeAdjust} | 涨幅： ${increased}%`}</span>
          </li>
) )}
        </ul>
      </div>
    );
  }

}
