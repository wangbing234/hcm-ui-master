import React, { PureComponent } from 'react';

import { debounce } from 'utils';

import { Input } from 'components/Base';

import styles from './OnBoardStaffs.less';

export default class Filter extends PureComponent {

  getPopupContainer = triggerNode => triggerNode;

  changeKeyword = debounce(
    val => {
      const { changeState } = this.props;
      return changeState('keyword', val);
    },
    300,
    e => [e.target.value]
  );

  render() {
    return (
      <div className={styles.filterBar}>
        <Input.Search
          onChange={this.changeKeyword}
          className={styles.keyword}
          placeholder="搜索员工"
        />
      </div>
    );
  }
}
