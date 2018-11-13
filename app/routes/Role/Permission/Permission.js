import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';

import { actions } from 'models/rolePermission';
import { createPromiseDispatch } from 'utils/actionUtil';

import EmptyPlaceholder from 'components/Biz/EmptyPlaceholder';

import RoleList from './RoleList';
import RoleDetail from './RoleDetail';

import styles from './Permission.less';

const { Sider, Content } = Layout;

const {
	GET_ROLE_PERMISSION_LIST,
  UPDATE_ROLE_PERMISSION_LIST,
} = actions;

@connect(({ rolePermission = {}, loading }) => ({
  loading: loading.models.rolePermission,
  ...rolePermission,
}))
class Permission extends Component {

  promiseDispatch = createPromiseDispatch();

	refreshRoleList(id) {
    this.promiseDispatch(GET_ROLE_PERMISSION_LIST, {}).then(res => {
      const { dispatch } = this.props;
      UPDATE_ROLE_PERMISSION_LIST(dispatch, { payload: res });
      if (id) {
        const { history } = this.props;
        const newUrl = id ? `/role_permission/${id}` : `/role_permission`;
        history.push(newUrl);
      }
    });
	}

  render() {
    const { rolePermissionList, match } = this.props;
    const currentRoleId = parseInt(match.params.id, 10);
    return (
      <Layout style={{ height: '100%' }}>
        <Sider style={{ background: '#f9f9f9', borderRight: '1px solid #eaeaea' }} width={300}>
          <RoleList
            currentRoleId={currentRoleId}
            roles={rolePermissionList}
            onRefreshList={(id) => this.refreshRoleList(id)}
          />
        </Sider>
        <Content style={{ background: '#fff' }}>
          {currentRoleId === -1 ?
          (
            <div className={styles.empty}>
              <EmptyPlaceholder size={100} placeholder="请添加角色" />
            </div>
          ) :
          (
            <RoleDetail
              currentRoleId={currentRoleId}
              roles={rolePermissionList}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default Permission;
