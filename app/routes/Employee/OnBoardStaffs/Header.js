import React, { PureComponent } from 'react';

import { PERMISSION_CODE } from 'constants/permission';
import Permission from 'components/Permission';
import { Button } from 'components/Base';
import Filter from './Filter';

import styles from './OnBoardStaffs.less';

export default class Header extends PureComponent {
  OnEntry = () => {
    const { OnEntry } = this.props;
    OnEntry(true, 'view');
  };

  render() {
    const { changeState } = this.props;
    return (
      <header className={styles.header}>
        <div className={styles.name}>在职员工</div>
        <Filter changeState={changeState} />
        <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
          <Button type="primary" onClick={this.OnEntry}>
            员工入职
          </Button>
        </Permission>
      </header>
    );
  }
}
