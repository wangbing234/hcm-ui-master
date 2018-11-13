import React, { PureComponent } from 'react';

import { debounce } from 'utils';

import { Select, Input } from 'components/Base';

import styles from './grade.less';

export default class Filter extends PureComponent {

  getPopupContainer = triggerNode => triggerNode;

  changeKeyword = debounce(
    val => {
      const { changeState } = this.props;
      return changeState('keyword')(val);
    },
    300,
    e => [e.target.value]
  )

  render() {
    const { changeState, active } = this.props;
    return (
      <div className={styles.filterBar}>
        <Select
          getPopupContainer={this.getPopupContainer}
          onChange={changeState('active')}
          className={styles.filter}
          value={active}
        >
          <Select.Option value="1">有效职级</Select.Option>
          <Select.Option value="0">失效职级</Select.Option>
        </Select>
        <Input.Search
          onChange={this.changeKeyword}
          className={styles.keyword}
          placeholder="搜索职级"
        />
      </div>
    );
  }
}
