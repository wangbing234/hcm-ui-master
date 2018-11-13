import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Icon } from 'antd';
import { actions } from 'models/employee';
import { PERMISSION_CODE } from 'constants/permission';
import { EMPLOYEE_STATUS } from '../../constants/employee';
import styles from './ResignationInfo.less';
import ResignationModal from './ResignationModal';
import Permission from './Detail/Permission';

const {
  GET_EMPLOYEE_RESIGNATION_INFO,
  DOWNLOAD_FILE_BY_ID,
  CLEAR_EMPLOYEE_RESIGNATION,
} = actions;

const TYPES = Object.values(EMPLOYEE_STATUS);
const MAX_LENGTH = 120;

@connect(({ employee = {}, loading }) => ({
  loading: loading.models.employee,
  ...employee,
}))
class ResignationInfo extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    status: PropTypes.oneOf(TYPES).isRequired, // 员工状态
    // onEdit: PropTypes.func.isRequired,
    onResignationSave: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isResignationModalOpen: false,
    };
  }

  componentDidMount() {
    const { dispatch, id, status } = this.props;
    if (status === EMPLOYEE_STATUS.FORMER) {
      GET_EMPLOYEE_RESIGNATION_INFO(dispatch, { payload: id }); // TODO
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    CLEAR_EMPLOYEE_RESIGNATION(dispatch, { payload: null });
  }

  handleEdit() {
    this.setState({
      isResignationModalOpen: true,
    });
  }

  handleDownload() {
    const { dispatch, employeeResignation} = this.props;
    DOWNLOAD_FILE_BY_ID(dispatch, { payload: {
      fileId: employeeResignation.get('fileId'),
      fileName: employeeResignation.get('fileName'),
    } });
  }

  refreshList() {
    const { dispatch, id } = this.props;
    this.setState({ isResignationModalOpen: false });
    GET_EMPLOYEE_RESIGNATION_INFO(dispatch, { payload: id });
  }

  renderAttachment = () => {
    const { employeeResignation } = this.props;
    const fileName = employeeResignation.get('fileName');
    return (
      <div className={styles.attachment}>
        <Icon type="file" className={styles.fileIcon} />
        <span className={styles.fileName}>{fileName}</span>
        <div className={styles.download}>
          <Icon type="download" className={styles.downloadIcon} onClick={() => this.handleDownload()}/>
        </div>
      </div>
    );
  };

  render() {
    const { employeeResignation, status, id, onResignationSave } = this.props;
    if (status !== EMPLOYEE_STATUS.FORMER) {
      return null;
		}
		// if (loading) {
		// 	return (<div className={styles.loading}><Spin /></div>);
		// }
    if (employeeResignation && employeeResignation.size > 0) {
      const { isResignationModalOpen } = this.state;
      const date = employeeResignation.get('date');
      const name = employeeResignation.getIn(['handoverMan', 'name']);
      const reason = employeeResignation.get('reason');
      const displayReason =
        reason && reason.length > MAX_LENGTH ? `${reason.slice(0, MAX_LENGTH)}...` : reason;
      return (
        <div className={styles.wrapper}>
          <span className={styles.header}>
            离职信息
            <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
            <a className={styles.editBtn} onClick={() => this.handleEdit()}>
              编辑
            </a>
            </Permission>
          </span>
          <div className={styles.container}>
            <div className={styles.title}>离职日期</div>
            <div className={styles.value}>{date}</div>
            <div className={styles.title}>离职交接人</div>
            <div className={styles.value}>{name}</div>
            <div className={styles.title}>离职原因</div>
            <div className={styles.reason} title={reason}>
              {!displayReason ? '-' : displayReason}
            </div>
            {employeeResignation.get('fileId') ? this.renderAttachment() : null}
          </div>
          <ResignationModal
            visible={isResignationModalOpen}
            id={id}
            onSave={() => {
              this.refreshList();
              onResignationSave();
            }}
            onCancel={() => this.refreshList()}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ResignationInfo;
