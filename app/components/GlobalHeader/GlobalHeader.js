import React, { Component } from 'react';
import { Layout, Avatar, Menu } from 'antd';
import { Dropdown } from 'components/Base/';
import Brand from 'components/Biz/Brand';
import { actions } from 'models/login';
import { actions as golbalActions } from 'models/global';
import store from 'src/app';
import styles from './GlobalHeader.less';

const { Header } = Layout;

const { dispatch } = store;

const logout = () => {
  actions.LOGOUT(dispatch, {});
  golbalActions.CLEAR_ALL_PERMISSION(dispatch, {});
};

const userMenu = (
  <Menu style={{ width: 140 }}>
    <Menu.Item onClick={logout}>退出登录</Menu.Item>
  </Menu>
);

export default class GlobalHeader extends Component {
  render() {
    return (
      <Header className={styles.main} {...this.props}>
        <div className={styles.logo}>
          <Brand text="HCM" />
        </div>
        <div className={styles.operations}>
          <div className={styles.item}>
            <Dropdown overlay={userMenu}>
              <Avatar icon="user" />
            </Dropdown>
          </div>
        </div>
      </Header>
    );
  }
}
