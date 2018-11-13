import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { Alert } from 'antd';
import { Layout, Row, Column } from 'layouts/FormLayout';
import { Input, Modal, Button, Select, DatePicker, TreeSelect } from 'components/Base';
import FormBox from 'components/FormBox';
import visibleComponent from 'decorators/visibleComponent';
import { actions } from 'models/employee';
import { getIdFromKey } from 'utils/utils';
import styles from './TransferModal.less';

const {
  GET_COMPANY_TREE,
  CHANGE_EMPLOYEE_TRANSFER_FORM,
  GET_POSITIONS_LIST,
  GET_EMPLOYEE_MENUS,
  UPDATE_EMPLOYEE_TRANSFER_ERROR,
  SAVE_EMPLOYEE_TRANSFER,
  CLEAR_EMPLOYEE_TRANSFER,
} = actions;

@visibleComponent
@connect(({ employee = {}, loading }) => ({
  loading: loading.models.employee,
  ...employee,
}))
class TransferModal extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    GET_COMPANY_TREE(dispatch, {});
    GET_EMPLOYEE_MENUS(dispatch, {});
  }

  componentDidUpdate(prevProps) {
    const { isEmployeeTransfer, onSave, dispatch } = this.props;
    if (prevProps.isEmployeeTransfer === false && isEmployeeTransfer === true) {
      clearTimeout(this.timerAutoHideId);
      this.timerAutoHideId = setTimeout(() => {
        onSave();
        CLEAR_EMPLOYEE_TRANSFER(dispatch, { payload: null });
      }, 500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerAutoHideId);
  }

  onSave() {
    const errors = this.validateAll();
    if (errors && errors.size > 0) {
      this.onErrorChange(errors);
    } else {
      const { dispatch, id, employeeTransfer } = this.props;
      const data = {
        date: employeeTransfer.get('date'),
        reason: employeeTransfer.get('reason'),
        companyId: getIdFromKey(employeeTransfer.get('company')),
        departmentId: getIdFromKey(employeeTransfer.get('department')),
        positionId: employeeTransfer.get('positionId'),
        // gradeId: employeeTransfer.get('gradeId'),
        masterId: employeeTransfer.get('masterId'),
      };
      SAVE_EMPLOYEE_TRANSFER(dispatch, { payload: { id, data } });
    }
  }

  onCancel() {
    const { onCancel, dispatch } = this.props;
    onCancel();
    CLEAR_EMPLOYEE_TRANSFER(dispatch, { payload: null });
  }

  onErrorChange(errors) {
    const { dispatch } = this.props;
    UPDATE_EMPLOYEE_TRANSFER_ERROR(dispatch, { payload: errors });
  }

  onChange(type, value) {
    const { dispatch } = this.props;
    const errors = this.validate(type, value);
    this.onErrorChange(errors);
    CHANGE_EMPLOYEE_TRANSFER_FORM(dispatch, { payload: { type, value } });
  }

  getPositionsList(item) {
		const { dispatch } = this.props;
		const id = getIdFromKey(item);
    GET_POSITIONS_LIST(dispatch, { payload: { id } });
  }

  validate(type, value) {
    const { employeeTransferErrors } = this.props;
    let errors = employeeTransferErrors;
    if (type === 'date') {
      if (!value) {
        errors = errors.set('date', '请选择调岗日期');
      } else {
        errors = errors.delete('date');
      }
    }
    if (type === 'company') {
      if (!value) {
        errors = errors.set('company', '请选择新的公司');
      } else {
        errors = errors.delete('company');
      }
    }
    if (type === 'department') {
      if (!value) {
        errors = errors.set('department', '请选择新的部门');
      } else {
        errors = errors.delete('department');
      }
    }
    if (type === 'positionId') {
      if (!value) {
        errors = errors.set('positionId', '请选择新的岗位');
      } else {
        errors = errors.delete('positionId');
      }
    }
    if (type === 'masterId') {
      if (!value) {
        errors = errors.set('masterId', '请选择新的直接主管');
      } else {
        errors = errors.delete('masterId');
      }
    }

    return errors;
  }

  validateAll() {
    const { employeeTransfer, employeeTransferErrors } = this.props;
    let errors = employeeTransferErrors;
    if (!employeeTransfer.get('date')) {
      errors = errors.set('date', '请选择调岗日期');
    }
    if (!employeeTransfer.get('company')) {
      errors = errors.set('company', '请选择新的公司');
    }
    if (!employeeTransfer.get('department')) {
      errors = errors.set('department', '请选择新的部门');
    }
    if (!employeeTransfer.get('positionId')) {
      errors = errors.set('positionId', '请选择新的岗位');
    }
    if (!employeeTransfer.get('masterId')) {
      errors = errors.set('masterId', '请选择新的直接主管');
    }

    return errors;
  }

  renderDate() {
    const { employeeTransfer, employeeTransferErrors } = this.props;
    const transferDate = employeeTransfer.get('date') ? moment(employeeTransfer.get('date')) : null;
    return (
      <Row cols={1}>
        <Column>
          <FormBox isRequired label="调岗日期" errorMsg={employeeTransferErrors.get('date')}>
            <DatePicker
              error={!!employeeTransferErrors.get('date')}
              placeholder="请选择"
              style={{ width: '100%' }}
              value={transferDate}
              onChange={(date, dateString) => this.onChange('date', dateString)}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderReason() {
    const { employeeTransfer } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox label="调岗原因" isRequired={false} errorMsg="">
            <Input.TextArea
              placeholder="请输入"
              value={employeeTransfer.get('reason')}
              onChange={value => this.onChange('reason', value.target.value)}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderCompany() {
    const { employeeTransfer, employeeTransferErrors, companyTree } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox label="新的公司" isRequired errorMsg={employeeTransferErrors.get('company')}>
            <TreeSelect
              error={!!employeeTransferErrors.get('company')}
              style={{ width: '100%' }}
              showSearch
              treeNodeFilterProp="title"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              value={employeeTransfer.get('company')}
              treeData={[companyTree]}
              placeholder="请选择"
              treeDefaultExpandAll
              onChange={value => {
                this.onChange('company', value);
              }}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderDepartment() {
    const { employeeTransfer, employeeTransferErrors, departmentTree } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox label="新的部门" isRequired errorMsg={employeeTransferErrors.get('department')}>
            <TreeSelect
              error={!!employeeTransferErrors.get('department')}
              style={{ width: '100%' }}
              showSearch
              treeNodeFilterProp="title"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              value={employeeTransfer.get('department')}
              treeData={departmentTree}
              placeholder="请选择"
              treeDefaultExpandAll
              onChange={value => {
                if (value) {
                  this.getPositionsList(value);
                }
                return this.onChange('department', value);
              }}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderPosition() {
    const { employeeTransfer, employeeTransferErrors, positionListMap } = this.props;
    return (
      <Row cols={2}>
        <Column>
          <FormBox label="新的岗位" isRequired errorMsg={employeeTransferErrors.get('positionId')}>
            <Select
              error={!!employeeTransferErrors.get('positionId')}
              style={{ width: '100%' }}
              value={employeeTransfer.get('positionId')}
              onChange={value => this.onChange('positionId', value)}
              placeholder="请选择"
            >
              {(positionListMap[getIdFromKey(employeeTransfer.get('department'))]||[]).map(position => {
                const { id, name } = position;
                return (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                );
              })}
            </Select>
          </FormBox>
        </Column>
        <Column>
          <FormBox label="职级" isRequired errorMsg="">
            <Input disabled error={false} value={employeeTransfer.get('gradeName')} />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderMaster() {
    const { employeeTransfer, employeeTransferErrors, employeeMenus } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox
            label="新的直接主管"
            isRequired
            errorMsg={employeeTransferErrors.get('masterId')}
          >
            <Select
              showSearch
              optionFilterProp="title"
              error={!!employeeTransferErrors.get('masterId')}
              style={{ width: '100%' }}
              value={employeeTransfer.get('masterId')}
              onChange={value => {
                this.onChange('masterId', value);
              }}
              placeholder="请选择"
            >
              {employeeMenus &&
                employeeMenus.length > 0 &&
                employeeMenus.map(employee => (
                  <Select.Option key={employee.id} value={employee.id} title={employee.name}>
                    {employee.name}
                  </Select.Option>
                ))}
            </Select>
          </FormBox>
        </Column>
      </Row>
    );
  }

  render() {
    const { visible, isEmployeeTransfer, loading } = this.props;

    const title = (
      <div className={styles.headerWrapper}>
        <span className={styles.header}>员工调岗</span>
        <div className={styles.messageWrapper}>
          <Alert
            style={{ display: isEmployeeTransfer ? 'flex' : 'none' }}
            className={styles.message}
            message="调岗成功"
            type="success"
            showIcon
          />
        </div>
      </div>
    );

    const footer = (
      <div>
        <Button onClick={() => this.onCancel()}>取消</Button>
        <Button type="primary" onClick={() => this.onSave()} disabled={loading}>
          确认
        </Button>
      </div>
    );

    return (
      <Modal
        small
        onCancel={() => this.onCancel()}
        maskClosable={false}
        visible={visible}
        title={title}
        footer={footer}
      >
        <Layout>
          {this.renderDate()}
          {this.renderReason()}
          {this.renderCompany()}
          {this.renderDepartment()}
          {this.renderPosition()}
          {this.renderMaster()}
        </Layout>
      </Modal>
    );
  }
}

export default TransferModal;
