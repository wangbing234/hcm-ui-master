import React, { PureComponent } from 'react';

import { Button } from 'components/Base';
import Filter from './Filter';

import styles from './Position.less';

export default class Header extends PureComponent {
  render() {
    const { onCreate, ...rest } = this.props;
    return (
      <header className={styles.header}>
        <div className={styles.name}>岗位信息</div>
        <Filter {...rest} />
        {onCreate && (
          <Button onClick={onCreate} type="primary">
            新建岗位
          </Button>
        )}
      </header>
    );
  }
}
