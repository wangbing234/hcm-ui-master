import React, { PureComponent } from 'react';

import { debounce } from 'utils';

import { Select, Input } from 'components/Base';

import styles from './Company.less';

export default class Filter extends PureComponent {

  getPopupContainer = triggerNode => triggerNode;

  changeKeyword = debounce(
    val => {
      const { changeState } = this.props;
      return changeState('keyword')(val);
    },
    300,
    e => [e.target.value]
  );
  
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
          <Select.Option value="1">有效公司</Select.Option>
          <Select.Option value="0">失效公司</Select.Option>
        </Select>
        <Input.Search
          onChange={this.changeKeyword}
          className={styles.keyword}
          placeholder="搜索公司"
        />
      </div>
    );
  }
}
