import * as Immutable from 'immutable';

import { PERMISSION_CODE } from 'constants/permission';

import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { RoleService } from '../services/role';

const {
  ORGANIZATION_MANAGE,
  ORGANIZATION,
  COMPANY,
  DEPARTMENT,
  POSITION,
  GRADE,
} = PERMISSION_CODE;

const roleService = new RoleService();
const {
	getRolePermissionList,
	addRole,
	editRole,
	deleteRole,
  getOrgTree,
  getRolePermissionDetail,
  saveRolePermissionDetail,
} = roleService;

const NAMESPACE = 'rolePermission';

const ACTION_NAMES = new Actions({
	GET_ROLE_PERMISSION_LIST: null,
	CREATE_ROLE: null,
	EDIT_ROLE: null,
	DELETE_ROLE: null,
  UPDATE_ROLE_PERMISSION_LIST: null,

  GET_ORG_TREE: null,
  GET_ROLE_PERMISSION_DETAIL: null,
  CHANGE_BACKEND_PERMISSION_FORM: null,
  SAVE_ROLE_PERMISSION_DETAIL: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取角色列表
  [ACTION_NAMES.GET_ROLE_PERMISSION_LIST]: {
    servers: getRolePermissionList.bind(roleService),
		use: [convertToImmutable],
    reducerName: 'rolePermissionList',
    reducer: merge2State('rolePermissionList'),
  },
	// 新增角色
	[ACTION_NAMES.CREATE_ROLE]: {
    servers: addRole.bind(roleService),
  },
	// 修改角色
	[ACTION_NAMES.EDIT_ROLE]: {
    servers: editRole.bind(roleService),
  },
	// 删除角色
	[ACTION_NAMES.DELETE_ROLE]: {
    servers: deleteRole.bind(roleService),
  },
  // 保存角色权限配置
	[ACTION_NAMES.SAVE_ROLE_PERMISSION_DETAIL]: {
    servers: saveRolePermissionDetail.bind(roleService),
  },
});

export default {
  namespace: NAMESPACE,

  state: {
    rolePermissionList: null,
    orgQueryTree: null,
    roleDetail: null,
    orgEditTree: null,
  },

  effects: {
    ...effects,
    *[ACTION_NAMES.GET_ROLE_PERMISSION_DETAIL]({ payload }, { call, put }) {
      const { id } = payload;
      const [orgTree, detail] = yield [
        call(getOrgTree, {}), // 获取公司、部门树
        call(getRolePermissionDetail, {id}), // 获取角色权限配置详细
      ];
      yield put({
        type: 'getRolePermissionDetail',
        payload: {
          orgTree,
          detail,
        },
      });
    },
    *[ACTION_NAMES.CHANGE_BACKEND_PERMISSION_FORM]({ payload }, { put }) {
      yield put({
        type: 'changeBackendPermissionFrom',
        payload,
      });
    },
    *[ACTION_NAMES.UPDATE_ROLE_PERMISSION_LIST]({ payload }, { put }) {
      yield put({
        type: 'updateRolePermissionList',
        payload,
      });
    },
  },

  reducers: {
    ...reducers,
    // 获取角色权限配置详细
    getRolePermissionDetail(state, { payload }) {
      const { orgTree, detail } = payload;
      const roleDetail = Immutable.fromJS(detail);
      const convert2TargetTree = compose(addClose2Tree, convertToImmutable);
      // 组织管理-可查询数据范围-value
      const orgMgtQueryValue = getValueInData(roleDetail, ORGANIZATION_MANAGE, 'GET');

      // 组织管理-可查询数据范围-treeData
      const convertOrgQueryTree = compose(convertInitData2Tree, addClose2Tree, convertToImmutable);
      const orgQueryTree = convertOrgQueryTree(orgTree);

      // 组织管理-可编辑数据范围-treeData
      const initOrgEditTree = findTreeItem(orgQueryTree, orgMgtQueryValue);
      const orgEditTree = convert2TargetTree(initOrgEditTree.toJS());

      // 人事管理-可查询数据范围-value
      const employeeMgtQueryValue = getValueInData(roleDetail, 'employeeManage', 'GET');

      // 人事管理-可编辑数据范围-treeData
      const initEmployeeMgtEditTree = findTreeItem(orgQueryTree, employeeMgtQueryValue);
      const employeeEditTree = convert2TargetTree(initEmployeeMgtEditTree.toJS());

      return {
        ...state,
        roleDetail,
        orgQueryTree,
        orgEditTree,
        employeeQueryTree: orgQueryTree,
        employeeEditTree,
      };
    },
    // 管理后台权限表单-onChange
    changeBackendPermissionFrom(state, { payload }) {
      const { roleDetail, orgQueryTree, orgEditTree, employeeEditTree } = state;
      const { code, permission } = payload;
      let newRoleDetail = roleDetail;
      let newOrgEditTree = orgEditTree;
      let newEmployeeEditTree = employeeEditTree;

      const convert2TargetTree = compose(addClose2Tree, convertToImmutable);

      const currentCodeIndex = getCodeIndex(roleDetail, code);

      const orgInfoCodeIndex = getCodeIndex(roleDetail, ORGANIZATION);
      const companyInfoCodeIndex = getCodeIndex(roleDetail, COMPANY);
      const departmentInfoCodeIndex = getCodeIndex(roleDetail, DEPARTMENT);
      const positionInfoCodeIndex = getCodeIndex(roleDetail, POSITION);
      const gradeInfoCodeIndex = getCodeIndex(roleDetail, GRADE);

      if (code === ORGANIZATION_MANAGE && permission.action === 'GET') {
        if (permission.conditions[0].value === -1) {
          // 关闭查询/编辑数据范围
          const newBackend = newRoleDetail.get('backend')
            .filterNot(item =>
              item.get('code') === ORGANIZATION_MANAGE ||
              item.get('code') === ORGANIZATION ||
              item.get('code') === COMPANY ||
              item.get('code') === DEPARTMENT ||
              item.get('code') === POSITION ||
              item.get('code') === GRADE);
          newRoleDetail = newRoleDetail.set('backend', newBackend);
        } else {
          // 开启并选择数据范围
          const newPermissions = [
            permission,
            Immutable.fromJS(permission).set('action', 'EDIT').toJS(),
          ];
          const newOrganizationManageCode = Immutable.fromJS({
            code: ORGANIZATION_MANAGE,
            name: "组织管理",
            type: "catalogue",
            permissions: newPermissions,
          });
          const newOrganizationCode = Immutable.fromJS({
            code: ORGANIZATION,
            name: "组织架构",
            type: "menu",
            permissions: [
              {
                action: "GET",
                conditions: [{
                  field: "organizationId",
                  op: "include",
                  value: parseInt(orgQueryTree.getIn([1, 'key']), 10),
                }],
              },
              Immutable.fromJS(permission).set('action', 'EDIT').toJS(),
            ],
          });
          const newCompanyCode = Immutable.fromJS({
            code: COMPANY,
            name: "公司信息",
            type: "menu",
            permissions: newPermissions,
          });
          const newDepartmentCode = Immutable.fromJS({
            code: DEPARTMENT,
            name: "部门信息",
            type: "menu",
            permissions: newPermissions,
          });
          const newPositionCode = Immutable.fromJS({
            code: POSITION,
            name: "岗位信息",
            type: "menu",
            permissions: newPermissions,
          });

          let newBackend = newRoleDetail.get('backend');
          newBackend = getNewBackend(newBackend, currentCodeIndex, newOrganizationManageCode);
          newBackend = getNewBackend(newBackend, orgInfoCodeIndex, newOrganizationCode);
          newBackend = getNewBackend(newBackend, companyInfoCodeIndex, newCompanyCode);
          newBackend = getNewBackend(newBackend, departmentInfoCodeIndex, newDepartmentCode);
          newBackend = getNewBackend(newBackend, positionInfoCodeIndex, newPositionCode);
          newRoleDetail = newRoleDetail.set('backend', newBackend);

          // 组织管理-可编辑数据范围-treeValue
          newOrgEditTree = findTreeItem(orgQueryTree, permission.conditions[0].value.toString());
          if (newOrgEditTree.get('type') === DEPARTMENT) {
            // 组织管理，“可查询数据范围”、“可编辑数据范围”选择的是部门时，“公司信息”可编辑、可查询都是关闭，不可修改。
            newRoleDetail = newRoleDetail.deleteIn(['backend', getCodeIndex(newRoleDetail, COMPANY)]);
          }
          newOrgEditTree = convert2TargetTree(newOrgEditTree);
        }
      }

      if (code === ORGANIZATION_MANAGE && permission.action === 'EDIT') {
        if (permission.conditions[0].value === -1) {
          // 关闭编辑数据范围
          newRoleDetail = newRoleDetail
            .setIn(['backend', currentCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, currentCodeIndex, 'GET'))
            .setIn(['backend', orgInfoCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, orgInfoCodeIndex, 'GET'))
            .setIn(['backend', companyInfoCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, companyInfoCodeIndex, 'GET'))
            .setIn(['backend', departmentInfoCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, departmentInfoCodeIndex, 'GET'))
            .setIn(['backend', positionInfoCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, positionInfoCodeIndex, 'GET'))
            .setIn(['backend', gradeInfoCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, gradeInfoCodeIndex, 'GET'));
        } else {
          const newPermission = Immutable.fromJS(permission);
          const currentItem = findTreeItem(orgEditTree, permission.conditions[0].value.toString());

          let companyInfo = newPermission;
          if (currentItem.get('type') === 'department') {
            companyInfo = newPermission.setIn(['conditions', 0, 'value'], -1);
          }

          newRoleDetail = newRoleDetail
            // 组织管理-可编辑数据范围-value
            .setIn(['backend', currentCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, currentCodeIndex, 'EDIT')], newPermission)
            .setIn(['backend', orgInfoCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, orgInfoCodeIndex, 'EDIT')], newPermission)
            .setIn(['backend', companyInfoCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, companyInfoCodeIndex, 'EDIT')], companyInfo)
            .setIn(['backend', departmentInfoCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, departmentInfoCodeIndex, 'EDIT')], newPermission)
            .setIn(['backend', positionInfoCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, positionInfoCodeIndex, 'EDIT')], newPermission);
        }
      }

      if (code === GRADE && permission.action === 'GET') {
        if (permission.value === 1) {
          const newRoleCode = Immutable.fromJS({
            code: GRADE,
            name: "职级信息",
            type: "menu",
            permissions: [
              { action: 'GET' },
            ],
          });
          const newBackend = newRoleDetail.get('backend').push(newRoleCode);
          newRoleDetail = newRoleDetail.set('backend', newBackend);
        } else {
          newRoleDetail = newRoleDetail
            .deleteIn(['backend', currentCodeIndex]);
        }
      }

      if (code === GRADE && permission.action === 'EDIT') {
        if (permission.value === 1) {
          newRoleDetail = newRoleDetail
            .setIn(['backend', currentCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, currentCodeIndex, 'EDIT')], Immutable.fromJS({action: 'EDIT'}));
        } else {
          newRoleDetail = newRoleDetail
            .deleteIn(['backend', currentCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, currentCodeIndex, 'EDIT')]);
        }
      }

      if (code === 'employeeManage' && permission.action === 'GET') {
        if (permission.conditions[0].value === -1) {
          // 关闭编辑数据范围
          const newBackend = newRoleDetail.get('backend').delete(currentCodeIndex);
          newRoleDetail = newRoleDetail.set('backend', newBackend);
        } else {
          // 开启并选择数据范围
          const newEmployeeManageCode = Immutable.fromJS({
            code: "employeeManage",
            name: "人事管理",
            type: "catalogue",
            permissions: [
              permission,
              Immutable.fromJS(permission).set('action', 'EDIT').toJS(),
            ],
          });
          let newBackend = newRoleDetail.get('backend');
          newBackend = getNewBackend(newBackend, currentCodeIndex, newEmployeeManageCode);
          // 人事管理-可查询/编辑数据范围-value
          newRoleDetail = newRoleDetail.set('backend', newBackend);
          // 人事管理-可编辑数据范围-treeValue
          newEmployeeEditTree = findTreeItem(orgQueryTree, permission.conditions[0].value.toString());
          newEmployeeEditTree = convert2TargetTree(newEmployeeEditTree);
        }
      }

      if (code === 'employeeManage' && permission.action === 'EDIT') {
        if (permission.conditions[0].value === -1) {
          // 关闭编辑数据范围
          newRoleDetail = newRoleDetail
            .setIn(['backend', currentCodeIndex, 'permissions'], createNewPermissions(newRoleDetail, currentCodeIndex, 'GET'));
        } else {
          // 开启并选择数据范围
          newRoleDetail = newRoleDetail
            // 人事管理-可编辑数据范围-value
            .setIn(['backend', currentCodeIndex, 'permissions', getPermissionIndex(newRoleDetail, currentCodeIndex, 'EDIT')], Immutable.fromJS(permission));
        }
      }

      // console.log(newRoleDetail.toJS());
      // TODO
      return {
        ...state,
        roleDetail: newRoleDetail,
        orgEditTree: newOrgEditTree,
        employeeEditTree: newEmployeeEditTree,
      };
    },
    updateRolePermissionList(state, { payload }) {
      return {
        ...state,
        rolePermissionList: Immutable.fromJS(payload),
      };
    },
  },
};

function compose(...args) {
  const fns = [].slice.call(args);
  return (initialAgr) => {
    let res = initialAgr;
    for (let i = 0; i < fns.length; i += 1) {
      res = fns[i](res);
    }
    return res;
  }
}

function convertToImmutable(data) {
  return Immutable.fromJS(data);
}

function findTreeItem(list = Immutable.fromJS([]), value) {
  if (value === '-1') {
    return list;
  }
  let res = null;
  const loop = (data, key) => {
    data.map(item => {
      if (item.get('value') === key) {
        res = item;
        return res;
      } else {
        return loop(item.get('children'), key);
      }
    });
  };
  if (list && list.size > 0) {
    loop(list, value);
  }
  return res;
}

function getValueInData(roleDetail, code, action) {
  let value = '';
  const codeIndex = roleDetail
    .get('backend')
    .findIndex(item => item && item.get('code') ? item.get('code') === code : false);

  if (codeIndex === -1) {
    value = '-1';
  } else {
    const actionIndex = roleDetail
      .getIn(['backend', codeIndex, 'permissions'])
      .findIndex(item => item && item.get('action') ? item.get('action') === action : false);

    if (actionIndex === -1) {
      value = '-1';
    } else {
      value = roleDetail
        .getIn(['backend', codeIndex, 'permissions', actionIndex, 'conditions', 0]) // TODO 0: first condition
        .get('value').toString();
    }
  }

  return value;
}

function getNewBackend(backend, codeIndex, newCode) {
  let newBackend = backend;
  if (codeIndex === -1) {
    newBackend = newBackend.push(newCode);
  } else {
    newBackend = newBackend.set(codeIndex, newCode);
  }
  return newBackend;
}

function convertInitData2Tree({ id, name, code, children, type }) {
  return {
    key: id.toString(),
    type,
    title: `${code  }  ${  name}`,
    value: id.toString(),
    children: children && children.map(convertInitData2Tree),
  };
}

function addClose2Tree(data = {}) {
  const close = {
    key: '-1',
    type: null,
    title: '关闭',
    value: '-1',
    children: [],
  }
  return [close, data];
}

function getCodeIndex(roleDetail, code) {
  const codeIndex = roleDetail.get('backend')
    .findIndex(item => item && item.size > 0 ? item.get('code') === code : false);
  return codeIndex;
}

function createNewPermissions(roleDetail, codeIndex, action) {
  const newPermissions = roleDetail
    .getIn(['backend', codeIndex, 'permissions'])
    .filter(item => item.get('action') === action);
  return newPermissions;
}

function getPermissionIndex(roleDetail, codeIndex, actionType) {
  const permissionIndex = roleDetail
    .getIn(['backend', codeIndex, 'permissions'])
    .findIndex(item => item && item.size > 0 ? item.get('action') === actionType : false);
  const permissionSize = roleDetail.getIn(['backend', codeIndex, 'permissions']).size;

  return permissionIndex > -1 ? permissionIndex : permissionSize;
}
