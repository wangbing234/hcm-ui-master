import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Motion, spring } from 'react-motion';
import styles from './SubMenu.less';

export default class SubMenu extends PureComponent {
  static propTypes = {
    titleIcon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
  };

  // 子菜单
  renderChildren = (style = {}) => {
    const { menuData, location } = this.props;
    return (
      <div style={style} className={styles.children}>
        {menuData.filter(({hide}) => !hide).map(child => (
          <div
            key={child.path}
            className={classnames(styles.child, {
              [styles.selected]: !location.pathname.indexOf(child.path),
            })}
          >
            <Link to={child.path}>{child.name}</Link>
          </div>
        ))}
      </div>
    );
  };

  // 折叠起来的下拉
  renderDropdown = () => {
    const { menuData, location } = this.props;
    return (
      <div className={styles.siderMenuDropdown}>
        <ul className="ant-dropdown-menu ant-dropdown-menu-light">
          {menuData.map(child => (
            <li
              key={child.path}
              className={classnames('ant-dropdown-menu-item', {
                'ant-dropdown-menu-item-active': !location.pathname.indexOf(child.path),
              })}
            >
              <Link to={child.path}>{child.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  render() {
    const { title, titleIcon, min, open, menuData, onToggle } = this.props;
    const childrenHeight = open * menuData.filter(({hide}) => !hide).length * 36;

    return (
      <div
        onClick={onToggle}
        className={classnames(styles.subMenu, { [styles.expanded]: open }, { [styles.min]: min })}
      >
        <div className={styles.titleWrapper}>
          <span className={styles.title}>
            <span className={titleIcon} />
            <span className={styles.titleText}>{title}</span>
          </span>
          {!min && <span className={open ? 'icon-up' : 'icon-down'} />}
          {min && <div className={styles.fixedTitle}>{title}</div>}
        </div>
        {min ? (
          this.renderDropdown()
        ) : (
          <Motion
            defaultStyle={{ height: min ? childrenHeight : 0 }}
            style={{ height: spring(childrenHeight) }}
          >
            {this.renderChildren}
          </Motion>
        )}
      </div>
    );
  }
}
