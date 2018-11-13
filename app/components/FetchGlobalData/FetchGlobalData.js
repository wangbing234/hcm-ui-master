import { Component, Children } from 'react';
import { createPromiseDispatch } from 'utils/actionUtil';
import { actions } from 'models/global';
import PropTypes from 'prop-types';

const {
  FETCH_USER,
  FETCH_MENUS,
  FETCH_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
  UPDATE_USER,
} = actions;

class FetchGlobalData extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchGlobalData();
  }

  promiseDispatch = createPromiseDispatch();

  fetchGlobalData = () => {
    const { dispatch } = this.props;
    // 获取角色权限
    this.promiseDispatch(FETCH_USER_PERMISSION, { }).then(permission => {
      UPDATE_USER_PERMISSION(dispatch, { payload: permission }); // 更新权限信息
      FETCH_MENUS(dispatch, {}); // 获取菜单
    });
    // 获取用户信息
    this.promiseDispatch(FETCH_USER, {}).then(user => {
      UPDATE_USER(dispatch, { payload: user }); // 更新用户信息
    });
  };

  render() {
    const { children } = this.props;
    if (children) {
      return Children.only(children);
    } else {
      return null;
    }
  }
}

export default FetchGlobalData;
