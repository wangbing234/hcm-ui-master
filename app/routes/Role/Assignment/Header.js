import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { actions } from 'models/roleAssignment';

import { Tooltip, Divider } from 'antd';
import Filter from './Filter';

import styles from './Assignment.less';

const { GET_SUPERADMIN_INFO } = actions;

@connect(({ roleAssignment = {}, loading }) => ({
  querySuperAdmin: roleAssignment.querySuperAdmin,
  loading: loading.models.roleAssignment,
}))


export default class Header extends PureComponent {

  componentDidMount(){
    const { dispatch } = this.props;
    GET_SUPERADMIN_INFO(dispatch, {});

  }
  render() {
    const { querySuperAdmin, ...rest  } = this.props;
    const name = querySuperAdmin&&querySuperAdmin.name ? querySuperAdmin.name : '-';
    const mobile = querySuperAdmin&&querySuperAdmin.mobile ? querySuperAdmin.mobile : '-';
    return (
      <header className={styles.header}>
        <div className={styles.info}>
          <h3>{name}</h3>
          超级管理员
          <Tooltip
            overlayClassName={styles.tooltip}
            placement="bottomLeft"
            title="超级管理员拥有所有模块所有数据的查询、修改、删除权限及“角色与权限”的编辑权限"
          >
            <span className="icon-o-info" />
          </Tooltip>
          <Divider type="vertical" />手机号：{mobile}
        </div>
        <Filter {...rest}  />
      </header>
    );
  }
}
