import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TreeSelect } from 'antd';
import './TreeSelect.less';

const { TreeNode } = TreeSelect;

class HcmTreeSelect extends Component {
  static propTypes = {
    error: PropTypes.bool,
    renderTitle: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]), // 渲染标题，例如：可以对标题加图标
  };

  static defaultProps = {
    error: false,
    renderTitle: false,
  };

  // 自定义 render
  renderTreeNode = (data) => {
    const { renderTitle } =  this.props;
    return data.map(item => {
      const { title, children, ...rest } = item;
      const treeNodeProps = {
        title: renderTitle(item),
        label: title,
        ...rest,
      };
      if (children) {
        return <TreeNode {...treeNodeProps}>{this.renderTreeNode(children)}</TreeNode>;
      }
      return <TreeNode {...treeNodeProps} />;
    });
  }

  render() {
    const {
      error,
      className,
      onChange,
      renderTitle,
      treeData,
      ...props
    } = this.props;

    const cls = classNames({
      [`ant-select-error`]: error,
      [className]: className,
    });

    const onChangeProp = (value, label, extra) => {
      if (value) {
        onChange(value, label, extra);
      }
    }

    // 通过 treeNode 方式生成树
    if (renderTitle) {
      return (
        <TreeSelect
          className={cls}
          onChange={onChangeProp}
          {...props}
          treeNodeFilterProp="label"
          treeNodeLabelProp="label"
        >
          {this.renderTreeNode(treeData)}
        </TreeSelect>
      )
    } else {
      return (
        <TreeSelect
          treeData={treeData}
          className={cls}
          onChange={onChangeProp}
          {...props}
        />
      )
    }
  }
}

export default HcmTreeSelect;
