import React, { PureComponent } from 'react';

import { connect } from 'dva';
import { DatePicker, TreeSelect } from 'antd';

import immutable from 'immutable';
import moment from 'moment';

import { TREE_TYPE } from 'constants/employee';

import { Select } from 'components/Base';

import ConfigableFieldLayout, { fieldValueStrategy } from 'components/Biz/ConfigableField/Layout';

import configableFieldStrategy from 'components/Biz/ConfigableField';

function getContactContentLabel( type ) {
  switch (type) {
    case 'homePhone':
      return '电话';
    case 'email':
      return 'Email';
    default :
      return  '详细地址';
  }
}

const FULL_WIDTH_STYLE = {
  width: '100%',
};

const PLACEHOLDER_SELECT = '请选择';

const TREE_PROPS = {
  showSearch: true,
  treeDefaultExpandAll: true,
  treeNodeFilterProp: "title",
  placeholder: PLACEHOLDER_SELECT,
  style: FULL_WIDTH_STYLE,
  dropdownStyle: { maxHeight: 400, overflow: 'auto' },
};

const SELECT_PROPS = {
  style: FULL_WIDTH_STYLE,
  placeholder:  PLACEHOLDER_SELECT,
};

function exceptionInput( Comp, staticProps ) {
  return getProps => value => <Comp {...staticProps} value={value} {...getProps()}/>
}

const renderTreeSelect = exceptionInput(TreeSelect, TREE_PROPS);
const renderSelect = exceptionInput(SelectWithOptions, SELECT_PROPS);

function SelectWithOptions({options, ...other}) {
  return (
<Select {...other}>
    {options && options.map(({id, name}) => {
      return (
        <Select.Option key={id} value={id}>
          {name}
        </Select.Option>
      );
    })}
  </Select>
)
}

const POSITION_PATH = ['positionInfo', 'position'];

@connect(({ employee = {} }) => ({
  detail: employee.detail,
  companyTree: employee.companyTree,
  positionListMap: employee.positionListMap,
  employeeMenus: employee.employeeMenus,
}))
export default class EmployeeFormLayout extends PureComponent {

  constructor(props) {
    super(props);

    this.createFieldElement = configableFieldStrategy(
      {
        company: renderTreeSelect(() => ({
          treeData: [this.getProp('companyTree')],
          onChange: this.willChange('company'),
        })),
        department: renderTreeSelect(() => ({
          treeData: getDepartmentTree(this.getProp('companyTree'), this.getProp('data').get('company')),
          onChange: this.willChange('department'),
        })),
        position: renderSelect(() => ({
          options: this.getProp('positionListMap')[getRealId(this.getProp('data').get('department'))],
          onChange: this.willChange('position'),
        })),
        grade: renderSelect(() => ({
          disabled: true,
          options: (this.getProp('positionListMap')[getRealId(this.getProp('data').get('department'))]||[]).map(({gradeId, gradeName}) => ({
            id: gradeId,
            name: gradeName,
          })),
        })),
        leader: renderSelect(() => ({
          options: this.getProp('employeeMenus').filter( ({id}) => id !== this.getProp('detail').getIn(['header', 'id']) ),
          onChange: this.willChange('leader'),
        })),
        endDate: value => {
          const period = this.getProp('data').get('period');
          if( period && period.indexOf('year') === 0 ) {
            return (
<DatePicker
              value={value ? moment(value) : undefined}
              style={{ width: '100%' }}
              placeholder={PLACEHOLDER_SELECT}
              disabled
            />
)
          }
        },
      },
      this.onChange,
    );

    const formPath = POSITION_PATH.concat(props.idx);
    this.getFieldValue = fieldValueStrategy({
      company: () => this.getProp('detail').getIn(formPath.concat('companyName')),
      department: () => this.getProp('detail').getIn(formPath.concat('departmentName')),
      position: () => this.getProp('detail').getIn(formPath.concat('positionName')),
      grade: () => this.getProp('detail').getIn(formPath.concat('gradeName')),
      leader: () => this.getProp('detail').getIn(formPath.concat('leaderName')),
    });
  }

  onChange = (code, value) => {
    const { id, idx, onChange } = this.props;
    onChange(id, idx, code, value);
  };

  getProp = name => {
    const { [name]: prop } = this.props;
    return prop;
  };

  getFormField = () => {
    const { id, data, formField } = this.props;
    if( id === 'contact' ) {
      return formField.map( field => {
        if( field.code === 'content' ) {
          return {
            ...field,
            label: getContactContentLabel(data.get('type')),
          };
        }
        return field;
      } );
    }
    return formField;
  }

  willChange = code => value => this.onChange(code, value);

  render() {
    const { data, error, isView } = this.props;
    return (
      <ConfigableFieldLayout
        isView={isView}
        formField={this.getFormField()}
        data={data.toJS()}
        error={error}
        onChange={this.onChange}
        createFieldElement={this.createFieldElement}
        getFieldValue={this.getFieldValue}
      />
    );
  }
}

function getDepartmentTree(tree, companyId) {
  let res = [];
  const loop = data => {
    return data.forEach(item => {
      const value = item.get('value');
      const children = item.get('children');
      if (value === companyId) {
        res = disabledCompany(children.toJS());
      } else {
        loop(children);
      }
    });
  };
  loop(immutable.fromJS([tree]));
  return res;
}

function disabledCompany(array) {
  return array.map(item => {
    const newItem = item;
    if (item.type === TREE_TYPE.DEPARTMENT) {
      newItem.disabled = false;
    } else {
      newItem.disabled = true;
    }
    if (newItem.children && newItem.children.length > 0) {
      disabledCompany(newItem.children);
    }
    return newItem;
  });
}

function getRealId( treeId = '' ) {
  return (treeId.split('-') || [])[1];
}
