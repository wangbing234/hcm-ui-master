import React, { Component } from 'react';
import * as Immutable from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Popover, Alert } from 'antd';
import { Layout, Row, Column } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import { Input, Modal, Button, Select, DatePicker } from 'components/Base';
import visibleComponent from 'decorators/visibleComponent';
import { actions } from 'models/employee';
import { removeDataBase64 } from 'utils/utils';
import styles from './ResignationModal.less';

const DEFAULT_FILE_SIZE_MAX = 1024 * 1000 * 10;

const {
  GET_EMPLOYEE_MENUS,
  CHANGE_EMPLOYEE_RESIGNATION,
  DELETE_RESIGNATION_ATTACHMENT,
  UPDATE_EMPLOYEE_RESIGNATION_ERROR,
  CLEAR_EMPLOYEE_RESIGNATION,
  SAVE_EMPLOYEE_RESIGNATION,
} = actions;

@visibleComponent
@connect(({ employee = {}, loading }) => ({
  loading: loading.models.employee,
  ...employee,
}))
class ResignationModal extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    GET_EMPLOYEE_MENUS(dispatch, {});
  }

  componentDidUpdate(prevProps) {
    const { isEmployeeResignation, onSave, dispatch } = this.props;
    if (prevProps.isEmployeeResignation === false && isEmployeeResignation === true) {
      clearTimeout(this.timerAutoHideId);
      this.timerAutoHideId = setTimeout(() => {
        onSave();
        CLEAR_EMPLOYEE_RESIGNATION(dispatch, { payload: null });
      }, 500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerAutoHideId);
  }

  onCancel() {
    const { dispatch, onCancel } = this.props;
    CLEAR_EMPLOYEE_RESIGNATION(dispatch, { payload: null });
    onCancel();
  }

  onSave() {
    const errors = this.validateAll();
    if (errors && errors.size > 0) {
      this.onErrorChange(errors);
    } else {
			const { dispatch, employeeResignation, id } = this.props;
			const data = {
				date: employeeResignation.get('date'),
				handoverManId: employeeResignation.getIn(['handoverMan', 'id']),
				reason: employeeResignation.get('reason'),
				fileName: employeeResignation.get('fileName'),
				attachment: removeDataBase64(employeeResignation.get('attachment')),
			};
      SAVE_EMPLOYEE_RESIGNATION(dispatch, { payload: { id, data } });
    }
  }

  onChooseFile(evt) {
    const { files } = evt.target;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      const fileName = file.name;
      const fileSize = file.size;
      const { employeeResignationErrors } = this.props;
      if (fileSize <= DEFAULT_FILE_SIZE_MAX) {
        return event => {
          const { result } = event.target;
          const fileContent = result; // .split('base64,')[1];
          this.onChange('fileName', fileName);
          this.onChange('attachment', fileContent);
          this.clearAttachmentError();
        };
      } else {
        const newErrors = employeeResignationErrors.set('attachment', '请上传小于10mb的附件');
        this.onErrorChange(newErrors);
      }
    })();
    reader.readAsDataURL(file);
    evt.target.value = ''; // eslint-disable-line no-param-reassign
  }

  onDeleteFile() {
    const { dispatch } = this.props;
    DELETE_RESIGNATION_ATTACHMENT(dispatch, { payload: null });
  }

  onErrorChange(newErrors) {
    const { dispatch } = this.props;
    UPDATE_EMPLOYEE_RESIGNATION_ERROR(dispatch, { payload: newErrors });
  }

  onChange(type, value) {
    const { dispatch } = this.props;
    const errors = this.validate(type, value);
    this.onErrorChange(errors);
    CHANGE_EMPLOYEE_RESIGNATION(dispatch, { payload: { type, value } });
  }

  validate(type, value) {
    const { employeeResignationErrors } = this.props;
    let errors = employeeResignationErrors;
    if (type === 'date') {
      if (!value) {
        errors = errors.set('date', '请选择离职日期');
      } else {
        errors = errors.delete('date');
      }
    }
    if (type === 'handoverMan') {
      if (!value.get('id') || !value.get('name')) {
        errors = errors.set('handoverMan', '请选择离职交接人');
      } else {
        errors = errors.delete('handoverMan');
      }
    }

    return errors;
  }

  validateAll() {
    const { employeeResignation, employeeResignationErrors } = this.props;
    let errors = employeeResignationErrors;

    if (!employeeResignation.get('date')) {
      errors = errors.set('date', '请选择离职日期');
    }

    if (!employeeResignation.getIn(['handoverMan', 'id'])) {
      errors = errors.set('handoverMan', '请选择离职交接人');
    }

    // if (!employeeResignation.get('fileName')) {
    //   errors = errors.set('attachment', '请上传离职评估小结');
    // }

    return errors;
  }

  clearAttachmentError() {
    const { employeeResignationErrors } = this.props;
    const newErrors = employeeResignationErrors.delete('attachment');
    this.onErrorChange(newErrors);
  }

  renderDate() {
    const { employeeResignation, employeeResignationErrors } = this.props;
    const qualifyDate = employeeResignation.get('date')
      ? moment(employeeResignation.get('date'))
      : null;
    return (
      <Row cols={1}>
        <Column>
          <FormBox isRequired label="离职日期" errorMsg={employeeResignationErrors.get('date')}>
            <DatePicker
              error={!!employeeResignationErrors.get('date')}
              placeholder="请选择"
              style={{ width: '100%' }}
              value={qualifyDate}
              onChange={(date, dateString) => this.onChange('date', dateString)}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderResponser() {
    const { employeeResignation, employeeResignationErrors, employeeMenus, id } = this.props;
    const hasOpitions = employeeMenus && employeeMenus.length > 0;
    return (
      <Row cols={1}>
        <Column>
          <FormBox
            label="离职交接人"
            isRequired
            errorMsg={employeeResignationErrors.get('handoverMan')}
          >
            <Select
              showSearch
              labelInValue
              disabled={!hasOpitions}
              error={!!employeeResignationErrors.get('handoverMan')}
              optionFilterProp="title"
              style={{ width: '100%' }}
              value={{
                key: employeeResignation.getIn(['handoverMan', 'id']),
                label: employeeResignation.getIn(['handoverMan', 'name']),
              }}
              onChange={value => {
                this.onChange('handoverMan', Immutable.fromJS({id: value.key, name: value.label}));
                // this.onChange('handoverManName', value.label);
              }}
              placeholder="请选择"
            >
              {hasOpitions &&
                employeeMenus.filter(item => item.id !== id).map(employee => (
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

  renderReason() {
    const { employeeResignation } = this.props;
    return (
      <Row cols={1}>
        <Column>
          <FormBox label="离职原因" isRequired={false} errorMsg="">
            <Input.TextArea
              placeholder="请输入"
              value={employeeResignation.get('reason')}
              onChange={value => this.onChange('reason', value.target.value)}
            />
          </FormBox>
        </Column>
      </Row>
    );
  }

  renderAttachment() {
    const { employeeResignation } = this.props;
    const fileName = employeeResignation.get('fileName');
    return (
      <Row cols={1}>
        <Column>
          {fileName ? (
            <div className={styles.attachment}>
              <Icon type="file" className={styles.fileIcon} />
              <span className={styles.fileName}>{fileName}</span>
              <div className={styles.delete} onClick={() => this.onDeleteFile()}>
                <span className={classnames(styles.deleteIcon, {
                  [`icon-o-trash`]: true,
                })}/>
              </div>
            </div>
          ) : (
            <label className={styles.uploadWrapper} htmlFor="doc_upload_input">
              <Button style={{ width: '100%', background: '#f9f9f9' }}>
                <span className={styles.fileButtonName}>+ 离职评估小结</span>
                <input
                  className={styles.fileInput}
                  type="file"
                  disabled={false}
                  id="doc_upload_input"
                  onChange={e => this.onChooseFile(e)}
                />
              </Button>
              <Popover
                className={styles.popover}
                trigger="hover"
                content={<span>限制上传大小10mb</span>}
              >
                <span className={styles.fileTips}>上传要求</span>
              </Popover>
            </label>
          )}
        </Column>
      </Row>
    );
  }

  render() {
    const { visible, employeeResignationErrors, isEmployeeResignation, loading } = this.props;

    const title = (
      <div className={styles.headerWrapper}>
        <span className={styles.header}>员工离职</span>
        <div className={styles.messageWrapper}>
          <Alert
            style={{ display: employeeResignationErrors.get('attachment') ? 'flex' : 'none' }}
            className={styles.message}
            message={employeeResignationErrors.get('attachment')}
            type="warning"
            showIcon
          />
          <Alert
            style={{ display: isEmployeeResignation ? 'flex' : 'none' }}
            className={styles.message}
            message="离职成功"
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
          {this.renderResponser()}
          {this.renderReason()}
          {this.renderAttachment()}
        </Layout>
      </Modal>
    );
  }
}

export default ResignationModal;
