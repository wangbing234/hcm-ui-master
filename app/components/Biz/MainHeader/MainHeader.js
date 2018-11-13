import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './MainHeader.less';

class MainHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: '请设置标题',
  };

  render() {
    const { children, title, className } = this.props;
    const cls = classNames({
      [styles.header]: true,
      [className]: className,
    });
    return (
      <header className={cls}>
        <h3>{title}</h3>
        {children}
      </header>
    );
  }
}

export default MainHeader;
