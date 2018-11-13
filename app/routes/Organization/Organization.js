import React, { Component } from 'react';
import { Tree, Icon, Menu } from 'antd';
import { connect } from 'dva';
import { PERMISSION_CODE } from 'constants/permission';
import { actions } from 'models/organization';
import { actions as companyActions } from 'models/company';
import { actions as departmentActions } from 'models/department';
import { Button, Input, Dropdown, Loading } from 'components/Base';
import MainHeader from 'components/Biz/MainHeader';
import MainBody from 'components/Biz/MainBody';
import Permission from 'components/Permission';
import { closest, tree2flat } from 'utils/utils';

import Operation from './Operation';

import styles from './Organization.less';

const { TreeNode, DirectoryTree } = Tree;

const { FETCH_TREE_DATA } = actions;

const treeHoverClassStr = 'ant-tree-treenode-hover';
const PopupContainerClassStr = 'span.ant-tree-node-content-wrapper';

/**
 * key treeNode的key
 * tree 整个树形菜单数据
 */
const getParentKey = (key, tree) => {
  let parentKey;
  tree.forEach(node => {
    const { children, id } = node;
    if (children) {
      if (children.some(item => item.id === key)) {
        parentKey = `${id}`;
      } else if (getParentKey(key, children)) {
        parentKey = getParentKey(key, children);
      }
    }
  });
  return parentKey;
};

@connect(({ organization = {}, loading, company, department }) => ({
  department,
  company,
  ...organization,
  loading: loading.models.organization,
}))
class Organization extends Component {
  state = {
    searchValue: '',
    expandedKeys: [],
    autoExpandParent: true,
    treeHoverId: null, // 标记鼠标经过的菜单项 UID
  };

  componentDidMount() {
    this.getTreeData();
  }

  // 获取组织架构树
  getTreeData = () => {
    const { dispatch } = this.props;
    FETCH_TREE_DATA(dispatch, {});
  };

  handleMouseEnter = info => {
    const { props } = info.node;
    this.setState({ treeHoverId: props.id });
  };

  handleMouseLeave = () => {
    this.setState({ treeHoverId: null });
  };

  handleTreeClick = (e, treeNode) => {
    const { rowData } = treeNode.props;
    if( rowData.enableEdit ) {
      this.handleEdit(rowData);
    }
  }

  handleExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 搜索树
  handleSearch = e => {
    const { treeData } = this.props;
    const { value } = e.target;
    const expandedKeys = tree2flat(treeData)
      .map(item => {
        const { name: title, id } = item;
        if (title.indexOf(value) > -1) {
          return getParentKey(id, treeData);
        }
        return null;
      })
      .filter((item, i, context) => item && context.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  // 更新正在编辑的公司信息
  handleUpdateCompanyInfo = payload => {
    const { dispatch } = this.props;
    companyActions.UPDATE_COMPANY_INFO(dispatch, { payload });
  };

  // 更新正在编辑的部门信息
  handleUpdateDepartmentInfo = payload => {
    const { dispatch } = this.props;
    departmentActions.UPDATE_DEPARTMENT_INFO(dispatch, { payload });
  };

  // 编辑
  handleEdit = item => {
    const { children, type, ...rest } = item;

    // 编辑公司
    if (type === 'company') {
      this.handleNewCompany({
        ...rest,
      });
    }
    // 编辑部门
    if (type === 'department') {
      this.handleNewDepartment({
        ...rest,
      });
    }
  };

  // 新建部门
  handleNewDepartment = item => {
    let info = item;
    if (!info) {
      info = {};
    }
    this.handleUpdateDepartmentInfo(info);
  };

  // 新建公司
  handleNewCompany = item => {
    let info = item;
    if (!info) {
      info = {};
    }
    this.handleUpdateCompanyInfo(info);
  };

  /**
    dropdown 操作
    @item {Object} Tree item 数据
    @e {Object} dropdown event
  */
  handleDropdownClick = (item, e) => {
    e.domEvent.stopPropagation();
    switch (e.key) {
      // 编辑
      case 'edit':
        this.handleEdit(item, e);
        break;
      // 在某个公司下新建公司需要传递 parentId
      case 'company':
        this.handleNewCompany({
          parentId: item.id,
        });
        break;
      // 在某个部门下新建部门需要传递 parentId
      case 'department':
        this.handleNewDepartment({
          parentId: `${item.type}-${item.id}-${item.name}`,
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { treeData, loading, ...rest } = this.props;
    const { searchValue, expandedKeys, autoExpandParent, treeHoverId } = this.state;

    // tree title
    const renderTitle = item => {
      const { name: title, type } = item;
      const index = title.indexOf(searchValue);
      const beforeStr = title.substr(0, index);
      const afterStr = title.substr(index + searchValue.length);

      const menu = (
        <Menu
          className={styles.dropdownMenu}
          onClick={e => {
            this.handleDropdownClick(item, e);
          }}
        >
          <Menu.Item key="edit">编辑</Menu.Item>
          {/* 只有公司下面才能新建公司 */}
          {type === 'company' && <Menu.Item key="company">新建公司</Menu.Item>}
          <Menu.Item key="department">新建部门</Menu.Item>
        </Menu>
      );

      // 搜索高亮标题
      const highlightTitle =
        index > -1 && searchValue ? (
          <span>
            {beforeStr}
            <b>{searchValue}</b>
            {afterStr}
          </span>
        ) : (
          <span>{title}</span>
        );

      return (
        <div>
          <Permission code={PERMISSION_CODE.ORGANIZATION_MANAGE}>
            <Dropdown overlay={menu} getPopupContainer={e => closest(e, PopupContainerClassStr)}>
              <Icon className={styles.ellipsis} type="ellipsis" />
            </Dropdown>
          </Permission>
          <span>{highlightTitle}</span>
        </div>
      );
    };

    // tree item
    const renderTree = data => {
      // 定义图标类型
      const iconType = {
        company: <i className="icon-co-i" />,
        department: <i className="icon-i-branch" />,
      };

      return data.map(item => {
        const hoverClass = item.id === treeHoverId ? treeHoverClassStr : '';
        const treeNodeConfig = {
          className: hoverClass,
          selectable: false,
          icon: iconType[item.type],
          title: renderTitle(item),
          key: item.id,
          id: item.id,
          rowData: item,
        };

        if (item.children) {
          return <TreeNode {...treeNodeConfig}>{renderTree(item.children)}</TreeNode>;
        }
        return <TreeNode isLeaf {...treeNodeConfig} />;
      });
    };
    return (
      <Permission code={PERMISSION_CODE.ORGANIZATION_MANAGE}>
        {
          (hasPermission) => {
            return (
              <main className={styles.organization}>
              {loading && <Loading visible center />}
              <MainHeader title="组织架构">
              {
                hasPermission && (
                  <div style={{ float: 'right' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.handleNewDepartment();
                      }}
                    >
                      新建部门
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.handleNewCompany();
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      新建公司
                    </Button>
                  </div>)
                }
              </MainHeader>
              <MainBody className={styles.body}>
                {treeData && treeData[0] ? (
                  <div>
                    <Input.Search
                      onChange={this.handleSearch}
                      transparent
                      placeholder="搜索"
                      className={styles.search}
                    />
                    <div className={styles.tree}>
                      <DirectoryTree
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                        onClick={this.handleTreeClick}
                        showIcon
                        onExpand={this.handleExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        expandAction={false}
                      >
                        {renderTree(treeData)}
                      </DirectoryTree>
                    </div>
                  </div>
                ) : null}
                {/* 编辑公司、编辑部门等操作 */}
                <Operation
                  getTreeData={this.getTreeData}
                  onUpdateCompanyInfo={this.handleUpdateCompanyInfo}
                  onUpdateDepartmentInfo={this.handleUpdateDepartmentInfo}
                  {...rest}
                />
              </MainBody>
            </main>
            )
          }
        }
      </Permission>
    );
  }
}

export default Organization;
