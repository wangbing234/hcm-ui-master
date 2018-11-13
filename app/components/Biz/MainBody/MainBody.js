import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './MainBody.less';

class MainBody extends PureComponent {
  render() {
    const { children, className } = this.props;
    const cls = classNames({
      [styles.body]: true,
      [className]: className,
    });
    return <div className={cls}>{children}</div>;
  }
}

export default MainBody;
