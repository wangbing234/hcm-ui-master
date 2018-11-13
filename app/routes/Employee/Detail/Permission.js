import React from 'react';

import Permission from 'components/Permission';
import { PERMISSION_CODE } from 'constants/permission';

export const PermissionContext = React.createContext(false);

export default function EmployeePermission(props) {
  return (
<PermissionContext.Consumer>
    {enabled => (
      <Permission
        code={enabled ? PERMISSION_CODE.EMPLOYEE_MANAGE : 'noPermission'}
        {...props}
      />

    )}
  </PermissionContext.Consumer>
);
}
