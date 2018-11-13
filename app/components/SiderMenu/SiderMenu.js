import React, { Component } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { Link } from 'dva/router';
import SubMenu from './SubMenu';
import styles from './SiderMenu.less';

const { Sider } = Layout;

const MENU_SETTING = 'setting';

class SiderMenu extends Component {
  state = {
    collapsed: false,
    openedSubMenuKey: null, // 当前展开菜单的 key
  };

  componentWillReceiveProps(nextProps) {
    this.handleDefaultOpenMenu(nextProps);
  }

  // 切换菜单样式
  toggleCollapsed = () => {
    const { collapsed } = this.state;
    if (collapsed === false) {
      this.setState({
        openedSubMenuKey: null,
      });
    }
    this.setState({
      collapsed: !collapsed,
    });
  };

  // 切换子菜单
  toggleSubMenu = _key => {
    let key = _key;
    const { openedSubMenuKey } = this.state;
    if (key === openedSubMenuKey) {
      key = null;
    }
    this.setState({
      openedSubMenuKey: key,
    });
  };

  // 匹配路由对应父级菜单的 key
  matchPropsKey = props => {
    const { location, menus } = props;
    return menus.filter(({ children }) => {
      return children.some(child => {
        return !location.pathname.indexOf(child.path);
      });
    })[0];
  };

  // 处理默认展开的菜单
  handleDefaultOpenMenu = nextProps => {
    const { collapsed } = this.state;
    const matched = this.matchPropsKey(nextProps);
    this.setState({ openedSubMenuKey: null }, () => {
      if (matched && !collapsed) {
        this.toggleSubMenu(matched.key);
      }
    });
  };

  render() {
    const { menus, location, ...rest } = this.props;
    const { collapsed, openedSubMenuKey } = this.state;
    return (
      <Sider collapsed={collapsed} collapsedWidth={60} width={240}>
        <div
          onClick={this.toggleCollapsed}
          className={`${styles.switchBtn} ${collapsed ? 'icon-menu-1' : 'icon-oo'}`}
        />
        <div>
          {menus.map(({ key, name, children, icon, path }) => {
            if (key === MENU_SETTING) {
              if (children && children.length > 0) {
                return (
                  <Link
                    className={classnames(styles.subMenu, {
                      [styles.selected]: children[0].path === location.pathname,
                      [styles.collapsed]: collapsed,
                    })}
                    key={key}
                    to={path}
                  >
                    <div className={styles.title}>
                      <span className={icon} />
                      <span className={styles.titleText}>{name}</span>
                    </div>
                    {collapsed && <div className={styles.fixedTitle}>{name}</div>}
                  </Link>
                );
              } else {
                return null;
              }
            } else {
              return (
                <SubMenu
                  {...rest}
                  location={location}
                  menuData={children}
                  open={openedSubMenuKey === key}
                  min={collapsed}
                  key={key}
                  titleIcon={icon}
                  title={name}
                  onToggle={() => this.toggleSubMenu(key)}
                />
              );
            }
          })}
        </div>
      </Sider>
    );
  }
}

export default SiderMenu;
