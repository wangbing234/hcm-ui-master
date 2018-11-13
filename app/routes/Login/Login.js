import React, { Component } from 'react';
import { message } from 'antd';
import { Tabs } from 'components/Base';
import { actions } from 'models/login';
import { actions as globalActions } from 'models/global';
import { createPromiseDispatch } from 'utils/actionUtil';
import MSG from 'constants/msg';
import LoginByPhone from './LoginByPhone';
import LoginByPassword from './LoginByPassword';
import { setAuth, removeAuth, loginRedirect } from './helper';
import styles from './Login.less';

const { TabPane } = Tabs;

const { LOGIN_BY_PHONE, LOGIN_BY_PASSWORD, GET_CAPTCHA } = actions;

const { FETCH_USER_PERMISSION } = globalActions;


class Login extends Component {

  promiseDispatch = createPromiseDispatch();

  // 登录成功处理，拦截无权限用户
  handleLogin = (response) => {
    if (response) {
      setAuth(response); // 设置登录cookie
      this.promiseDispatch(FETCH_USER_PERMISSION, {}).then(data => {
        const { superAdmin, permission } = data;
        if (superAdmin === true || permission !== null) {
          loginRedirect(response); // 登录跳转
        } else {
          removeAuth(); // 移除登录cookie
          message.error(MSG.NO_PERMISSION);
        }
      });
    }
  }

  // 登录处理
  handleSubmit = (values, loginType) => {
    if (loginType === 'phone') {
      return this.promiseDispatch(LOGIN_BY_PHONE, values).then(this.handleLogin);
    }
    if (loginType === 'password') {
      return this.promiseDispatch(LOGIN_BY_PASSWORD, values).then(this.handleLogin);
    }
  };

  // 获取验证码
  handleGetCaptcha = (phone) => {
    return this.promiseDispatch(GET_CAPTCHA, phone);
  };

  render() {
    return (
      <div className={styles.main}>
        <h6 className={styles.title}>登录有招</h6>
        <Tabs className={styles.tabs}>
          <TabPane title="手机登录" id="phone">
            <LoginByPhone onGetCode={this.handleGetCaptcha} onSubmit={(values) => this.handleSubmit(values, 'phone')} />
          </TabPane>
          <TabPane title="账号密码登录" id="password">
            <LoginByPassword  onSubmit={(values) => this.handleSubmit(values, 'password')} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Login;
