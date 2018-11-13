import React, { Component } from 'react';
import TreeSelect from 'components/Base/TreeSelect';

/* 组织架构带图标 TreeSelect */

const ICONS = {
  company: <i className="icon-co-i" />,
  department: <i className="icon-i-branch" />,
};

class OrgTreeSelect extends Component {
  render() {
    const { ...rest } = this.props;
    return (
    <TreeSelect
      renderTitle={data => {
        const { type, title } = data;
        return (<span>{ICONS[type]}{title}</span>);
      }}
      {...rest} />
    )
  }
}

export default OrgTreeSelect;
