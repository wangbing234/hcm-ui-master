import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

@connect(({ global = {} }) => {
  return {
    userPermissions: global.permission,
  }
})
export default class Permission extends PureComponent {
  static propTypes = {
    code: PropTypes.string.isRequired, // 菜单代码
  };

  render() {
    let hasPermission = false;
    const { userPermissions, code, children } = this.props;
    const superAdmin = userPermissions.get('superAdmin');
    const permissions = userPermissions.getIn(['permission', 'backend']);

    if(superAdmin) {  // 超级管理员跳过权限检测
      hasPermission = true;
    } else if (permissions) { // 普通用户
      const matchedCode = permissions.find(permission => {
        return permission.get('code') === code;
      });

      if (matchedCode) {
        hasPermission = matchedCode.get('permissions').some(permission => {
          return permission.get('action') === 'EDIT';
        });
      }
    }

    if (typeof children === 'function') {
      return children(hasPermission, code);
    } else if (children && hasPermission) {
        return Children.only(children);
      } else {
        return null;
      }
  }
}
