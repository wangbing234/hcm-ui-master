import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'antd';
import { PERMISSION_CODE } from 'constants/permission';
import { EMPLOYEE_STATUS } from '../../constants/employee';
import styles from './StaffOperation.less';
import QualifyModal from './QualifyModal';
import TransferModal from './TransferModal';
import ResignationModal from './ResignationModal';
import Permission from './Detail/Permission';

const TYPES = Object.values(EMPLOYEE_STATUS);

const TO_DAYS = 1000 * 60 * 60 * 24;

class StaffOperation extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired, // 员工Id
    status: PropTypes.oneOf(TYPES).isRequired, // 员工状态
    hireDate: PropTypes.string.isRequired, // 入职日期
    probationEndDate: PropTypes.string.isRequired, // 试用期至
    onQualify: PropTypes.func.isRequired, // 转正
    onTransfer: PropTypes.func.isRequired, // 调岗
    onResignation: PropTypes.func.isRequired, // 离职
  };

  constructor(props) {
    super(props);
    this.state = {
      isQualifyModalOpen: false,
      isTransferModalOpen: false,
      isResignationModalOpen: false,
    };
  }

  handleQualify() {
    this.setState({
      isQualifyModalOpen: true,
    });
  }

  handleTransfer() {
    this.setState({
      isTransferModalOpen: true,
    });
  }

  handleResignation() {
    this.setState({
      isResignationModalOpen: true,
    });
  }

  renderProbation() {
    const { hireDate, probationEndDate } = this.props;
    const now = moment().format('YYYY-MM-DD');
    const diffDay = Math.ceil(moment(probationEndDate).diff(now) / TO_DAYS);

    let displayDay = '';
    let isAlarm = false;
    if (Object.is(diffDay, -0)) {
      displayDay = '今天';
    } else if (Object.is(diffDay, 0) || diffDay > 0) {
      displayDay = `${diffDay}天后`;
    } else {
      displayDay = `已过期${Math.abs(diffDay)}天`;
      isAlarm = true;
    }

    const cusWidth = (1 - diffDay / moment(probationEndDate).diff(hireDate, 'd')) * 100;
    const progressStyle = {
      width: isAlarm
        ? '100%'
        : `${cusWidth > 100 ? 100 : cusWidth}%`,
      background: isAlarm ? '#f15b50' : '#50c286',
    };

    return (
      <div className={styles.probationWrapper}>
        <div className={styles.baseInfo}>
          <span className={styles.finishDate}>{`试用期至${probationEndDate}`}</span>
          <span className={styles.remainDate}>{displayDay}</span>
          <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
            <Button type="primary" block="true" onClick={() => this.handleQualify()}>
              转正
            </Button>
          </Permission>
        </div>
        <div className={styles.progress} style={progressStyle} />
      </div>
    );
  }

  renderFormal() {
    return (
      <div className={styles.formalWrapper}>
        <Button className={styles.formalButton} onClick={() => this.handleTransfer()}>
          调岗
        </Button>
        <Button className={styles.formalButton} onClick={() => this.handleResignation()}>
          离职
        </Button>
      </div>
    );
  }

  render() {
    const { status, id, onQualify, onTransfer, onResignation } = this.props;
    const { isQualifyModalOpen, isTransferModalOpen, isResignationModalOpen } = this.state;
    if (status === EMPLOYEE_STATUS.FORMER) {
      return null;
    }
    return (
      <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
      <div className={styles.wrapper}>
        <span className={styles.header}>员工操作</span>
        <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
          {status === EMPLOYEE_STATUS.FORMAL ? this.renderFormal() : null}
        </Permission>
        {status === EMPLOYEE_STATUS.PROBATION ? this.renderProbation() : null}
        <QualifyModal
          visible={isQualifyModalOpen}
          id={id}
          onSave={() => {
            this.setState({ isQualifyModalOpen: false });
            onQualify();
          }}
          onCancel={() => this.setState({ isQualifyModalOpen: false })}
        />
        <TransferModal
          visible={isTransferModalOpen}
          id={id}
          onSave={() => {
            this.setState({ isTransferModalOpen: false });
            onTransfer();
          }}
          onCancel={() => this.setState({ isTransferModalOpen: false })}
        />
        <ResignationModal
          visible={isResignationModalOpen}
          id={id}
          onSave={() => {
            this.setState({ isResignationModalOpen: false });
            onResignation();
          }}
          onCancel={() => this.setState({ isResignationModalOpen: false })}
        />
      </div>
      </Permission>
    );
  }
}

export default StaffOperation;
