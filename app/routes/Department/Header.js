import React, { PureComponent } from 'react';

import { Button } from 'components/Base';
import Filter from './Filter';

import styles from './Department.less';

export default class Header extends PureComponent {
  render() {
    const { onCreate, ...rest } = this.props;
    return (
      <header className={styles.header}>
        <div className={styles.name}>部门信息</div>
        <Filter {...rest} />
        {onCreate && (
        <Button onClick={onCreate} type="primary">
          新建部门
        </Button>)}
      </header>
    );
  }
}
