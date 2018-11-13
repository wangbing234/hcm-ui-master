import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'dva/router';
import styles from './SettingMenu.less';

class SettingMenu extends Component {
  static propTypes = {
    menus: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
  };

  render() {
    const { pathname, menus } = this.props;
    return menus.map(group => {
      return (
        <div key={group.key} className={styles.groupWrapper}>
          <div className={styles.groupName}>{group.name}</div>
          {group && group.children
            ? group.children.map(menu => {
                const pathArr = pathname.split('/');
                const isSelected =
                  pathArr.some(name => name === group.key) &&
                  pathArr.some(name => name === menu.key);
                return (
                  <Link key={menu.key} to={`/setting/${group.key}/${menu.key}`}>
                    <div
                      className={classnames(styles.menuItem, {
                        [styles.selectedItem]: isSelected,
                      })}
                    >
                      {menu.name}
                    </div>
                  </Link>
                );
              })
            : null}
        </div>
      );
    });
  }
}

export default SettingMenu;
