import React, { PureComponent } from 'react';
import { Button } from 'components/Base';
import { Link } from 'dva/router';
import styles from './personnel.less';

export default class Header extends PureComponent {
  render() {
    const { onCreate, title } = this.props;
    const to = title === '岗位信息' ? 'position' : title === '其他信息' ? 'other' : 'basic';
    return (
      <header className={styles.header}>
        <div className={styles.title}>{title}</div>
        <Link replace to={`/setting/personnel/customField/${to}`}>
          <Button className={styles.button} onClick={onCreate} type="primary">
            新建{title}模块
          </Button>
        </Link>
      </header>
    );
  }
}
