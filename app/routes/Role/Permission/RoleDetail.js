import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'dva';
import { Spin } from 'antd';

import { PERMISSION_CODE } from 'constants/permission';
import { actions } from 'models/rolePermission';
import { createPromiseDispatch } from 'utils/actionUtil';

import { Button, TreeSelect, Select } from 'components/Base';
import styles from './Permission.less';

const {
  GET_ROLE_PERMISSION_DETAIL,
  CHANGE_BACKEND_PERMISSION_FORM,
  SAVE_ROLE_PERMISSION_DETAIL,
} = actions;

const {
  ORGANIZATION_MANAGE,
  ORGANIZATION,
  COMPANY,
  DEPARTMENT,
  POSITION,
  GRADE,
} = PERMISSION_CODE;

const COMMON_STYLE = { width: '100%', maxWidth: '300px' };

@connect(({ rolePermission = {}, loading }) => ({
  loading: loading.models.rolePermission,
  ...rolePermission,
}))
class RoleDetail extends Component {

  static propTypes = {
    currentRoleId: PropTypes.number.isRequired,
		roles: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
			showOrgMgtDetail: false,
      showPersonInfo: false,
		};
  }

  componentDidMount() {
    this.getRoleDetail();
  }

  onChange(code, type, permission) {
    const { dispatch } = this.props;
    CHANGE_BACKEND_PERMISSION_FORM(dispatch, { payload: { code, type, permission } });
  }

  onCancel() {
    this.getRoleDetail();
  }

  onSave() {
    const { roleDetail, currentRoleId } = this.props;
    this.promiseDispatch(SAVE_ROLE_PERMISSION_DETAIL, {
      id: currentRoleId,
      data: roleDetail.toJS(),
    }).then(() => {
      this.getRoleDetail();
    });
  }

  getRoleDetail() {
    const { currentRoleId, dispatch } = this.props;
    GET_ROLE_PERMISSION_DETAIL(dispatch, { payload: {id: currentRoleId} });
  }

  getValInSelectTree(code = ORGANIZATION_MANAGE, action = 'GET') {
    let value = '';
    const { roleDetail } = this.props;

    const codeIndex = roleDetail
      .get('backend')
      .findIndex(item => item && item.get('code') ? item.get('code') === code : false);

    if (codeIndex === -1) {
      value = '-1';
    } else {
      const actionIndex = roleDetail
        .getIn(['backend', codeIndex, 'permissions'])
        .findIndex(item => item && item.size > 0 ? item.get('action') === action : false);

      if (actionIndex === -1) {
        value = '-1';
      } else {
        value = roleDetail
          .getIn(['backend', codeIndex, 'permissions', actionIndex, 'conditions', 0]) // TODO 0: first condition
          .get('value')
          .toString();
      }
    }

    return value;
  }

  getValInSelect(code = GRADE, action = 'GET') {
    let value = '';
    const { roleDetail } = this.props;
    const codeIndex = roleDetail
      .get('backend')
      .findIndex(item => item && item.get('code') ? item.get('code') === code : false);
    if (codeIndex === -1) {
      value = 0;
    } else {
      value = roleDetail
        .getIn(['backend', codeIndex, 'permissions'])
        .findIndex(item => item && item.size > 0 ? item.get('action') === action : false) > -1 ? 1 : 0;
    }
    return value;
  }

  promiseDispatch = createPromiseDispatch();

  handleOrgMgtClick() {
    const { showOrgMgtDetail } = this.state;
    this.setState({
      showOrgMgtDetail: !showOrgMgtDetail,
    });
  }

  handlePersonInfoClick() {
    const { showPersonInfo } = this.state;
    this.setState({
      showPersonInfo: !showPersonInfo,
    });
  }

  renderHeader() {
    const { currentRoleId, roles } = this.props;
    const currentRole = roles.find(role => role && role.size > 0 ? role.get('id') === currentRoleId : null);
    return (
      <div className={styles.roleHeaderWrapper}>
        <span>{currentRole ? currentRole.get('name') : ''}</span>
        <span>角色权限</span>
        <div className={styles.toolWrapper}>
          <Button onClick={() => this.onCancel()}>取消</Button>
          <Button type="primary" style={{marginLeft: 10}} onClick={() => this.onSave()}>保存</Button>
        </div>
      </div>
    );
  }

  renderBOrgItem() {
    const { showOrgMgtDetail } = this.state;
    const { orgQueryTree, orgEditTree } = this.props;
    const treeSelectProps = {
      style: COMMON_STYLE,
      showSearch: true,
      treeNodeFilterProp: 'title',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      placeholder: "请选择",
      treeDefaultExpandAll: true,
    };
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
    };

    // 组织管理-可查询数据范围-value
    const orgMgtQueryValue = this.getValInSelectTree(ORGANIZATION_MANAGE, 'GET');
    // 组织管理-可编辑数据范围-value
    const orgMgtEditValue = this.getValInSelectTree(ORGANIZATION_MANAGE, 'EDIT');

    // 组织架构-可查询数据范围-value
    const orgInfoQueryValue = this.getValInSelectTree(ORGANIZATION, 'GET');
    // 组织架构-可编辑数据范围-value
    const orgInfoEditValue = this.getValInSelectTree(ORGANIZATION, 'EDIT');

    // 公司信息-可查询数据范围-value
    const companyInfoQueryValue = this.getValInSelectTree(COMPANY, 'GET');
    // 公司信息-可编辑数据范围-value
    const companyInfoEditValue = this.getValInSelectTree(COMPANY, 'EDIT');

    // 部门信息-可查询数据范围-value
    const departmentInfoQueryValue = this.getValInSelectTree(DEPARTMENT, 'GET');
    // 部门信息-可编辑数据范围-value
    const departmentInfoEditValue = this.getValInSelectTree(DEPARTMENT, 'EDIT');

    // 岗位信息-可查询数据范围-value
    const positionInfoQueryValue = this.getValInSelectTree(POSITION, 'GET');
    // 岗位信息-可编辑数据范围-value
    const positionInfoEditValue = this.getValInSelectTree(POSITION, 'EDIT');

    // 职级信息-可查询数据范围-value
    const gradeInfoQueryValue = this.getValInSelect(GRADE, 'GET');
    // 职级信息-可查询数据范围-value
    const gradeInfoEditValue = this.getValInSelect(GRADE, 'EDIT');

    const isOrgMgtQueryClose = orgMgtQueryValue === '-1';
    const isOrgMgtEditClose = orgMgtEditValue === '-1';

    return (
      <li className={classnames(styles.tr, styles.groupTr)}>
        <div className={styles.groupTitle}>
          <div className={styles.td} onClick={() => this.handleOrgMgtClick()}>
            <span className={classnames("icon-menu-down", {
              [styles.iconMenuRight]: !showOrgMgtDetail,
            })}
            />
            <span className={classnames(styles.moduleName, styles.orgModule)}>组织管理</span>
          </div>
          <div className={styles.td}>
            {/* 组织管理-可查询数据范围 */}
            <TreeSelect
              {...treeSelectProps}
              error={false}
              value={orgMgtQueryValue}
              treeData={orgQueryTree.toJS()}
              onChange={value => {
                this.onChange(ORGANIZATION_MANAGE, 'catalogue', {
                  action: "GET",
                  conditions: [{
                    field: "organizationId",
                    op: "include",
                    value: parseInt(value, 10),
                  }],
                });
              }}
            />
          </div>
          <div className={styles.td}>
            {/* 组织管理-可编辑数据范围 */}
            <TreeSelect
              {...treeSelectProps}
              disabled={isOrgMgtQueryClose}
              error={false}
              value={orgMgtEditValue}
              treeData={orgEditTree.toJS()}
              onChange={value => {
                this.onChange(ORGANIZATION_MANAGE, 'catalogue', {
                  action: "EDIT",
                  conditions: [{
                    field: "organizationId",
                    op: "include",
                    value: parseInt(value, 10),
                  }],
                });
              }}
            />
          </div>
        </div>
        <ul className={classnames(styles.groupPopup, {
            [styles.hidden]: !showOrgMgtDetail,
          })}
        >
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>组织架构</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              {/* 组织架构-可查询数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={orgInfoQueryValue}
                treeData={orgQueryTree.toJS()}
                onChange={value => {
                  this.onChange(ORGANIZATION, 'menu', {
                    action: "GET",
                    conditions: [{
                      field: "organizationId",
                      op: "include",
                      value: parseInt(value, 10),
                    }],
                  });
                }}
              />
            </div>
            <div className={styles.td}>
              {/* 组织架构-可编辑数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={orgInfoEditValue}
                treeData={orgQueryTree.toJS()}
                onChange={() => {}}
              />
            </div>
          </li>
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>公司信息</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              {/* 公司信息-可查询数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={companyInfoQueryValue}
                treeData={orgQueryTree.toJS()}
                onChange={() => {}}
              />
            </div>
            <div className={styles.td}>
              {/* 公司信息-可编辑数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={companyInfoEditValue}
                treeData={orgEditTree.toJS()}
                onChange={() => {}}
              />
            </div>
          </li>
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>部门信息</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              {/* 部门信息-可查询数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={departmentInfoQueryValue}
                treeData={orgQueryTree.toJS()}
                onChange={() => {}}
              />
            </div>
            <div className={styles.td}>
              {/* 部门信息-可编辑数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={departmentInfoEditValue}
                treeData={orgEditTree.toJS()}
                onChange={() => {}}
              />
            </div>
          </li>
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>岗位信息</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              {/* 岗位信息-可查询数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={positionInfoQueryValue}
                treeData={orgQueryTree.toJS()}
                onChange={() => {}}
              />
            </div>
            <div className={styles.td}>
              {/* 岗位信息-可编辑数据范围 */}
              <TreeSelect
                {...treeSelectProps}
                disabled
                error={false}
                value={positionInfoEditValue}
                treeData={orgEditTree.toJS()}
                onChange={() => {}}
              />
            </div>
          </li>
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>职级信息</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              {/* 职级信息-可查询数据范围 */}
              <Select
                {...selectProps}
                disabled={isOrgMgtQueryClose}
                error={false}
                value={gradeInfoQueryValue}
                onChange={value => {
                  this.onChange(GRADE, 'menu', {
                    action: "GET",
                    value,
                  });
                }}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
            <div className={styles.td}>
              {/* 职级信息-可编辑数据范围 */}
              <Select
                {...selectProps}
                disabled={isOrgMgtQueryClose || isOrgMgtEditClose || gradeInfoQueryValue === 0}
                error={false}
                value={gradeInfoEditValue}
                onChange={value => {
                  this.onChange(GRADE, 'menu', {
                    action: "EDIT",
                    value,
                  });
                }}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
          </li>
        </ul>
      </li>
    );
  }

  renderBEmployeeItem() {
    // 人事管理-可查询数据范围-value
    const employeeMgtQueryValue = this.getValInSelectTree('employeeManage', 'GET');
    // 人事管理-可编辑数据范围-value
    const employeeMgtEditValue = this.getValInSelectTree('employeeManage', 'EDIT');
    const { employeeQueryTree, employeeEditTree } = this.props;
    const treeSelectProps = {
      style: COMMON_STYLE,
      showSearch: true,
      treeNodeFilterProp: 'title',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      placeholder: "请选择",
      treeDefaultExpandAll: true,
    };

    const isEmployeeMgtQueryClose = employeeMgtQueryValue === '-1';

    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>人事管理</span>
        </div>
        <div className={styles.td}>
          <TreeSelect
            {...treeSelectProps}
            error={false}
            value={employeeMgtQueryValue}
            treeData={employeeQueryTree.toJS()}
            onChange={(value) => {
              this.onChange('employeeManage', 'catalogue', {
                action: "GET",
                conditions: [{
                  field: "organizationId",
                  op: "include",
                  value: parseInt(value, 10),
                }],
              });
            }}
          />
        </div>
        <div className={styles.td}>
          <TreeSelect
            {...treeSelectProps}
            error={false}
            disabled={isEmployeeMgtQueryClose}
            value={employeeMgtEditValue}
            treeData={employeeEditTree.toJS()}
            onChange={(value) => {
              this.onChange('employeeManage', 'catalogue', {
                action: "EDIT",
                conditions: [{
                  field: "organizationId",
                  op: "include",
                  value: parseInt(value, 10),
                }],
              });
            }}
          />
        </div>
      </li>
    );
  }

  renderBPayloadItem = () => {
    const treeSelectProps = {
      style: COMMON_STYLE,
      showSearch: true,
      treeNodeFilterProp: 'title',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      placeholder: "请选择",
      treeDefaultExpandAll: true,
      disabled: true, // TODO
    };
    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>薪资管理</span>
        </div>
        <div className={styles.td}>
          <TreeSelect
            {...treeSelectProps}
            error={false}
            value=""
            treeData={[]}
            onChange={() => {}}
          />
        </div>
        <div className={styles.td}>
          <TreeSelect
            {...treeSelectProps}
            error={false}
            value=""
            treeData={[]}
            onChange={() => {}}
          />
        </div>
      </li>
    );
  }

  renderBApprovalItem = () => {
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
      disabled: true, // TODO
    };
    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>审批管理</span>
        </div>
        <div className={styles.td}>
          <Select
            {...selectProps}
            error={false}
            value=""
            onChange={() => {}}
          >
            <Select.Option key={0} value={0}>关闭</Select.Option>
            <Select.Option key={1} value={1}>开启</Select.Option>
          </Select>
        </div>
        <div className={styles.td}>
          <Select
            {...selectProps}
            error={false}
            value=""
            onChange={() => {}}
          >
            <Select.Option key={0} value={0}>关闭</Select.Option>
            <Select.Option key={1} value={1}>开启</Select.Option>
          </Select>
        </div>
      </li>
    );
  }

  renderBackend() {
    return (
      <div className={styles.perrmissionWrapper}>
        <span className={styles.title}>管理后台权限</span>
        <div className={styles.tableWrapper}>
          <div className={styles.header}>
            <div>管理模块</div>
            <div>可查询数据范围</div>
            <div>可编辑数据范围</div>
          </div>
          <ul className={styles.table}>
            {this.renderBOrgItem()}
            {this.renderBEmployeeItem()}
            {this.renderBPayloadItem()}
            {this.renderBApprovalItem()}
          </ul>
        </div>
      </div>
    );
  }

  renderFOrgItem = () => {
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
      disabled: true, // TODO
    };
    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>组织信息</span>
        </div>
        <div className={styles.td}>
          <Select
            {...selectProps}
            error={false}
            value=""
            onChange={() => {}}
          >
            <Select.Option key={0} value={0}>关闭</Select.Option>
            <Select.Option key={1} value={1}>开启</Select.Option>
          </Select>
        </div>
        <div className={styles.td} />
      </li>
    );
  }

  renderFEmployeeItem() {
    const { showPersonInfo } = this.state;
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
      disabled: true, // TODO
    };
    return (
      <li className={classnames(styles.tr, styles.groupTr)}>
        <div className={styles.groupTitle}>
          <div className={styles.td} onClick={() => this.handlePersonInfoClick()}>
            <span className={classnames("icon-menu-down", {
              [styles.iconMenuRight]: !showPersonInfo,
            })}
            />
            <span className={classnames(styles.moduleName, styles.orgModule)}>个人信息</span>
          </div>
          <div className={styles.td}>
            <Select
              {...selectProps}
              error={false}
              value=""
              onChange={() => {}}
            >
              <Select.Option key={0} value={0}>关闭</Select.Option>
              <Select.Option key={1} value={1}>开启</Select.Option>
            </Select>
          </div>
          <div className={styles.td}>
            <Select
              {...selectProps}
              error={false}
              value=""
              onChange={() => {}}
            >
              <Select.Option key={0} value={0}>关闭</Select.Option>
              <Select.Option key={1} value={1}>开启</Select.Option>
            </Select>
          </div>
        </div>
        <ul className={classnames(styles.groupPopup, {
            [styles.hidden]: !showPersonInfo,
          })}
        >
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>岗位信息</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              <Select
                {...selectProps}
                error={false}
                value=""
                onChange={() => {}}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
            <div className={styles.td}>
              <Select
                {...selectProps}
                error={false}
                value=""
                onChange={() => {}}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
          </li>
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>教育经历</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              <Select
                {...selectProps}
                error={false}
                value=""
                onChange={() => {}}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
            <div className={styles.td}>
              <Select
                {...selectProps}
                error={false}
                value=""
                onChange={() => {}}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
          </li>
          <li className={styles.tr}>
            <div className={styles.td}>
              <span className={classnames(styles.moduleName, styles.name)}>工作经历</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.td}>
              <Select
                {...selectProps}
                error={false}
                value=""
                onChange={() => {}}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
            <div className={styles.td}>
              <Select
                {...selectProps}
                error={false}
                value=""
                onChange={() => {}}
              >
                <Select.Option key={0} value={0}>关闭</Select.Option>
                <Select.Option key={1} value={1}>开启</Select.Option>
              </Select>
            </div>
          </li>
        </ul>
      </li>
    );
  }

  renderFPayloadItem = () => {
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
      disabled: true, // TODO
    };
    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>工资单</span>
        </div>
        <div className={styles.td}>
          <Select
            {...selectProps}
            error={false}
            value=""
            onChange={() => {}}
          >
            <Select.Option key={0} value={0}>关闭</Select.Option>
            <Select.Option key={1} value={1}>开启</Select.Option>
          </Select>
        </div>
        <div className={styles.td} />
      </li>
    );
  }

  renderFSubordinateItem = () => {
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
      disabled: true, // TODO
    };
    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>下属人事信息</span>
        </div>
        <div className={styles.td}>
          <Select
            {...selectProps}
            error={false}
            value=""
            onChange={() => {}}
          >
            <Select.Option key={0} value={0}>关闭</Select.Option>
            <Select.Option key={1} value={1}>开启</Select.Option>
          </Select>
        </div>
        <div className={styles.td} />
      </li>
    );
  }

  renderFSubordinatePayloadItem = () => {
    const selectProps = {
      style: COMMON_STYLE,
      placeholder: "请选择",
      disabled: true, // TODO
    };
    return (
      <li className={styles.tr}>
        <div className={styles.td}>
          <span className={styles.moduleName}>下属薪资信息</span>
        </div>
        <div className={styles.td}>
          <Select
            {...selectProps}
            error={false}
            value=""
            onChange={() => {}}
          >
            <Select.Option key={0} value={0}>关闭</Select.Option>
            <Select.Option key={1} value={1}>开启</Select.Option>
          </Select>
        </div>
        <div className={styles.td} />
      </li>
    );
  }

  renderFrontend() {
    // TODO
    return (
      <div className={styles.perrmissionWrapper}>
        <span className={styles.title}>自助服务权限</span>
        <div className={styles.tableWrapper}>
          <div className={styles.header}>
            <div>管理模块</div>
            <div>可查询数据范围</div>
            <div>可编辑数据范围</div>
          </div>
          <ul className={styles.table}>
            {this.renderFOrgItem()}
            {this.renderFEmployeeItem()}
            {this.renderFPayloadItem()}
            {this.renderFSubordinateItem()}
            {this.renderFSubordinatePayloadItem()}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const { orgQueryTree, orgEditTree, roleDetail, loading } = this.props;
    if (!loading && orgQueryTree && orgEditTree && roleDetail) {
      return (
        <div className={styles.roleDetail}>
          {this.renderHeader()}
          {this.renderBackend()}
          {this.renderFrontend()}
        </div>
      );
    } else {
      return (<div className={styles.loading}><Spin /></div>);
    }

  }
}

export default RoleDetail;
