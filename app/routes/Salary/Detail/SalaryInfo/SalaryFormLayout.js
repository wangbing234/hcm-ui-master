import React, { PureComponent } from 'react';

// import { TreeSelect } from 'antd';

// import { Select } from 'components/Base';

import ConfigableFieldLayout, { fieldValueStrategy } from 'components/Biz/ConfigableField/Layout';

import configableFieldStrategy from 'components/Biz/ConfigableField';


export default class SalaryFormLayout extends PureComponent {

  onChange = (code, value) => {
    window.console.log(code, value);
    // const { id, idx, onChange } = this.props;
    // onChange(id, idx, code, value);
  };

  getProp = name => {
    const { [name]: prop } = this.props;
    return prop;
  };

  getFieldValue = fieldValueStrategy({
    // company: idx => this.getDataFromPath(POSITION_PATH.concat([idx, 'companyName'])),
    // department: idx => this.getDataFromPath(POSITION_PATH.concat([idx, 'departmentName'])),
    // position: idx => this.getDataFromPath(POSITION_PATH.concat([idx, 'positionName'])),
    // grade: idx => this.getDataFromPath(POSITION_PATH.concat([idx, 'gradeName'])),
    // leader: idx => this.getDataFromPath(POSITION_PATH.concat([idx, 'leaderName'])),
  });

  createFieldElement = configableFieldStrategy(
    {
      // company: value => (
      //   <TreeSelect
      //     style={{ width: '100%' }}
      //     showSearch
      //     treeNodeFilterProp="title"
      //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      //     value={value}
      //     treeData={[this.getProp('companyTree')]}
      //     placeholder="请选择"
      //     treeDefaultExpandAll
      //     onChange={companyId => {
      //       this.onChange('company', companyId);
      //     }}
      //   />
      // ),
      // department: value => (
      //   <TreeSelect
      //     style={{ width: '100%' }}
      //     showSearch
      //     treeNodeFilterProp="title"
      //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      //     value={value}
      //     treeData={this.getProp('departmentTree')}
      //     placeholder="请选择"
      //     treeDefaultExpandAll
      //     onChange={departmentId => {
      //       this.onChange('department', departmentId);
      //     }}
      //   />
      // ),
      // position: value => (
      //   <Select
      //     style={{ width: '100%' }}
      //     value={value}
      //     onChange={positionId => this.onChange('position', positionId)}
      //     placeholder="请选择"
      //   >
      //     {this.getProp('positionList').map(position => {
      //       const { id, name } = position;
      //       return (
      //         <Select.Option key={id} value={id}>
      //           {name}
      //         </Select.Option>
      //       );
      //     })}
      //   </Select>
      // ),
      // leader: value => (
      //   <Select
      //     style={{ width: '100%' }}
      //     value={value}
      //     onChange={leaderId => this.onChange('leader', leaderId)}
      //     placeholder="请选择"
      //   >
      //     {this.getProp('employeeMenus') &&
      //       this.getProp('employeeMenus').length > 0 &&
      //       this.getProp('employeeMenus').map(employee => (
      //         <Select.Option key={employee.id} value={employee.id} title={employee.name}>
      //           {employee.name}
      //         </Select.Option>
      //       ))}
      //   </Select>
      // ),
    },
    this.onChange,
  );

  render() {
    const { data, error, isView, formField } = this.props;
    return (
      <ConfigableFieldLayout
        isView={isView}
        formField={formField}
        data={data || {}}
        error={error}
        onChange={this.onChange}
        createFieldElement={this.createFieldElement}
        getFieldValue={this.getFieldValue}
      />
    );
  }
}
