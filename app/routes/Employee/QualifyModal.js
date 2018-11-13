import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import { Icon, Popover, Alert } from 'antd';
import { Layout, Row, Column } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import { Input, Modal, Button, DatePicker } from 'components/Base';
import visibleComponent from 'decorators/visibleComponent';
import { actions } from 'models/employee';
import { removeDataBase64 } from 'utils/utils';
import styles from './QualifyModal.less';

const DEFAULT_FILE_SIZE_MAX = 1024 * 1000 * 10;

const {
  CHANGE_EMPLOYEE_QUALIFY,
  DELETE_QUALIFY_ATTACHMENT,
  UPDATE_EMPLOYEE_QUALIFY_ERROR,
  CLEAR_EMPLOYEE_QUALIFY,
  SAVE_EMPLOYEE_QUALIFY,
} = actions;

@visibleComponent
@connect(({ employee = {}, loading }) => ({
  loading: loading.models.employee,
  ...employee,
}))
class QualifyModal extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { isEmployeeQualify, onSave, dispatch } = this.props;
    if (prevProps.isEmployeeQualify === false && isEmployeeQualify === true) {
      clearTimeout(this.timerAutoHideId);
      this.timerAutoHideId = setTimeout(() => {
				onSave();
				CLEAR_EMPLOYEE_QUALIFY(dispatch, { payload: null });
      }, 500);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerAutoHideId);
  }

  onCancel() {
    const { dispatch, onCancel } = this.props;
    CLEAR_EMPLOYEE_QUALIFY(dispatch, { payload: null });
    onCancel();
  }

  onSave() {
    const errors = this.validateAll();
    if (errors && errors.size > 0) {
      this.onErrorChange(errors);
    } else {
			const { dispatch, employeeQualify, id } = this.props;
			const data = {
				date: employeeQualify.get('date'),
				remark: employeeQualify.get('remark'),
				fileName: employeeQualify.get('fileName'),
				attachment: removeDataBase64(employeeQualify.get('attachment')),
			};
      SAVE_EMPLOYEE_QUALIFY(dispatch, { payload: { id, data } });
    }
  }

  onChooseFile(evt) {
    const { files } = evt.target;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (() => {
      const fileName = file.name;
      const fileSize = file.size;
      const { employeeQualifyErrors } = this.props;
      if (fileSize <= DEFAULT_FILE_SIZE_MAX) {
        return event => {
          const { result } = event.target;
          const fileContent = result; // .split('base64,')[1];
          this.onChange('fileName', fileName);
          this.onChange('attachment', fileContent);
          this.clearAttachmentError();
        };
      } else {
        const newErrors = employeeQualifyErrors.set('attachment', '请上传小于10mb的附件');
        this.onErrorChange(newErrors);
      }
    })();
    reader.readAsDataURL(file);
    evt.target.value = ''; // eslint-disable-line no-param-reassign
  }

  onDeleteFile() {
    const { dispatch } = this.props;
    DELETE_QUALIFY_ATTACHMENT(dispatch, { payload: null });
  }

  onErrorChange(newErrors) {
    const { dispatch } = this.props;
    UPDATE_EMPLOYEE_QUALIFY_ERROR(dispatch, { payload: newErrors });
  }

  onChange(type, value) {
    const { dispatch } = this.props;
    const errors = this.validate(type, value);
    this.onErrorChange(errors);
    CHANGE_EMPLOYEE_QUALIFY(dispatch, { payload: { type, value } });
  }

  validate(type, value) {
    const { employeeQualifyErrors } = this.props;
    let errors = employeeQualifyErrors;
    if (type === 'date') {
      if (!value) {
        errors = errors.set('date', '请选择转正日期');
      } else {
        errors = errors.delete('date');
      }
    }

    return errors;
  }

  validateAll() {
    const { employeeQualify, employeeQualifyErrors } = this.props;
    let errors = employeeQualifyErrors;

    if (!employeeQualify.get('date')) {
      errors = errors.set('date', '请选择转正日期');
    }

    // if (!employeeQualify.get('attachment')) {
    //   errors = errors.set('attachment', '请上传转正评估小结');
    // }

    return errors;
  }

  clearAttachmentError() {
    const { employeeQualifyErrors } = this.props;
    const newErrors = employeeQualifyErrors.delete('attachment');
    this.onErrorChange(newErrors);
  }

  renderAttachment() {
    const { employeeQualify } = this.props;
    const fileName = employeeQualify.get('fileName');
    return (
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
              <span className={styles.fileButtonName}>+ 转正评估小结</span>
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
    );
  }

  render() {
    const {
      visible,
      employeeQualify,
      employeeQualifyErrors,
      isEmployeeQualify,
      loading,
    } = this.props;
    const qualifyDate = employeeQualify.get('date') ? moment(employeeQualify.get('date')) : null;

    const title = (
      <div className={styles.headerWrapper}>
        <span className={styles.header}>员工转正</span>
        <div className={styles.messageWrapper}>
          <Alert
            style={{ display: employeeQualifyErrors.get('attachment') ? 'flex' : 'none' }}
            className={styles.message}
            message={employeeQualifyErrors.get('attachment')}
            type="warning"
            showIcon
          />
          <Alert
            style={{ display: isEmployeeQualify ? 'flex' : 'none' }}
            className={styles.message}
            message="转正成功"
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
          <Row cols={1}>
            <Column>
              <FormBox isRequired label="转正日期" errorMsg={employeeQualifyErrors.get('date')}>
                <DatePicker
                  error={!!employeeQualifyErrors.get('date')}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  value={qualifyDate}
                  onChange={(date, dateString) => this.onChange('date', dateString)}
                />
              </FormBox>
            </Column>
          </Row>
          <Row cols={1}>
            <Column>
              <FormBox label="转正备注" isRequired={false} errorMsg="">
                <Input.TextArea
                  placeholder="请输入"
                  value={employeeQualify.get('remark')}
                  onChange={value => this.onChange('remark', value.target.value)}
                />
              </FormBox>
            </Column>
          </Row>
          <Row cols={1}>{this.renderAttachment()}</Row>
        </Layout>
      </Modal>
    );
  }
}

export default QualifyModal;
