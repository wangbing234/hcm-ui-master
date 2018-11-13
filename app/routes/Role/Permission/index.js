import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Route, Switch, Redirect } from 'dva/router';
import { actions } from 'models/rolePermission';
import styles from './Permission.less';

const { GET_ROLE_PERMISSION_LIST } = actions;

const LoadPermissionComponent = Loadable({
  loader: () => import('./Permission.js'),
  loading: props => {
    const { error, pastDelay } = props;
    if (error) {
      // console.log(error);
      return <div>Error!</div>;
    } else if (pastDelay) {
      return <div className={styles.loading}><Spin /></div>;
    } else {
      return null;
    }
  },
});

@connect(({ rolePermission = {}, loading }) => ({
  loading: loading.models.rolePermission,
  ...rolePermission,
}))
class PermissionContainer extends Component {
  componentDidMount() {
    const { dispatch, rolePermissionList } = this.props;
    if (!rolePermissionList) {
      GET_ROLE_PERMISSION_LIST(dispatch, { payload: null });
    }
  }

  render() {
    const { rolePermissionList } = this.props;
    if (!rolePermissionList) {
      return <div className={styles.loading}><Spin /></div>;
    } else {
      const firstId =
        rolePermissionList && rolePermissionList.size > 0
          ? rolePermissionList.getIn([0, 'id'])
          : -1;
      return (
        <Switch>
          <Route exact path="/role_permission/:id" render={(props) => {
            const { id } = props.match.params;
            const currentRoleIndex = rolePermissionList.findIndex(item => item && item.size > 0 ? item.get('id') === parseInt(id, 10) : false)
            if (!~currentRoleIndex && id !== '-1') {
              return <Redirect to={`/role_permission/${firstId}`} />;
            } else {
              return <LoadPermissionComponent {...props}/>;
            }
          }} />
          <Route
            path="/role_permission"
            component={() => <Redirect to={`/role_permission/${firstId}`} />}
          />
        </Switch>
      );
    }
  }
}

export default PermissionContainer;
