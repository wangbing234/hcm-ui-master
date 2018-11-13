import React, { PureComponent } from 'react';

import Filter from './Filter';

import styles from './ResignedEmployees.less';

export default class Header extends PureComponent {
  render() {
    const { changeState } = this.props;
    return (
      <header className={styles.header}>
        <Filter changeState={changeState} />
        <div className={styles.name}>离职员工</div>
      </header>
    );
  }
}
