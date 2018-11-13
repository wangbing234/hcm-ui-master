import React, { Component } from 'react';
import { TABLE_DEFAULT_COLUMNS } from 'constants/getEmployees';
import { PERMISSION_CODE } from 'constants/permission';
import { getFirstLetterImg } from 'utils/pinyinUtil';
import MainTab from 'components/Biz/MainTabs';
import Permission from 'components/Permission';
import HCMTable from 'components/HCMTable';
import { Loading } from 'components/Base';
import Header from './Header';

import styles from '../Employee.less';

import Detail from '../Detail';
import TransferModal from '../TransferModal';
import ResignationModal from '../ResignationModal';

TABLE_DEFAULT_COLUMNS[0].render = (text, record) => (
  <div>
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <span>
          <img src={record.avatar || getFirstLetterImg(text)} alt="头像" />
        </span>
      </div>
    </div>
    <span className={styles.text}>{text}</span>
  </div>
);

class OnBoardStaffs extends Component {
  state = {
    index: undefined,
    label: 'view',
    openDetail: false,
    detailId: undefined,
  };

  onChange = key => {
    const { onChange } = this.props;
    onChange(key);
  };

  clearState = () => {
    this.setState({
      openDetail: false,
      label: 'view',
      detailId: undefined,
    });
  };

  changeToPrevId = () => {
    const { index } = this.state;
    const { status, formal, probation } = this.props;
    const employeesList = status === 'formal' ? formal : probation;
    const { id } = employeesList.content[index - 1];
    this.setState({
      index: index - 1,
      detailId: id,
    });
  };

  changeToNextId = () => {
    const { index } = this.state;
    const { status, formal, probation } = this.props;
    const employeesList = status === 'formal' ? formal : probation;
    const { id } = employeesList.content[index + 1];

    this.setState({
      index: index + 1,
      detailId: id,
    });
  };

  OnEntry = (openDetail, label) => {
    this.setState({
      openDetail,
      label,
      detailId: undefined,
    });
  };

  changeState = (name, val) => {
    const { changeState } = this.props;
    changeState(name, val);
  };

  render() {
    const {
      onChangePageConfig,
      payload,
      probation,
      formal,
      onRefresh,
      status,
      loading,
    } = this.props;

    const employeesList = status === 'formal' ? formal : probation;
    const len = employeesList !== null ? employeesList.content.length : 0;

    const leftTitle =
      formal === null
        ? [
            {
              key: 'formal',
              value: '正式员工 0',
            },
          ]
        : [
            {
              key: 'formal',
              value: `正式员工 ${formal.content.length}`,
            },
          ];
    const rightTitle =
      probation === null
        ? [
            {
              key: 'probation',
              value: '待转正员工 0',
            },
          ]
        : [
            {
              key: 'probation',
              value: `待转正员工 ${probation.content.length}`,
            },
          ];
    const title = leftTitle.concat(rightTitle);

    const { openDetail, detailId, label, index } = this.state;

    const tableItemActions = [
      {
        action: ({ id }, _undefined, i) => {
          this.setState({
            index: i,
            openDetail: true,
            label: 'view',
            detailId: id,
          });
        },
        label: '查看',
      },
      {
        action: ({ id }) => {
          this.setState({
            label: 'transfer',
            detailId: id,
          });
        },
        label: '调岗',
      },
      {
        action: ({ id }) => {
          this.setState({
            label: 'resignation',
            detailId: id,
          });
        },
        label: '离职',
      },
    ];
    return (
      <div className={styles.container}>
        <div className={styles.HCM_body}>
          <Header
            className={styles.HCM_body}
            changeState={this.changeState}
            OnEntry={this.OnEntry}
          />
          <MainTab title={title} defaultActiveKey={title[0].key} onChange={this.onChange} />
        </div>
        <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
        {hasPermission => (
<div className={styles.listTable}>
          <Loading visible={loading} center />
          {status === 'formal' ? (
            <HCMTable
              withEnableEdit
              rowSelection={undefined}
              columns={TABLE_DEFAULT_COLUMNS}
              data={formal}
              itemActions={hasPermission && tableItemActions}
              onChangePageConfig={onChangePageConfig}
              actionPayload={payload}
              onRowClick={(item, i) => {
                this.setState({
                  index: i,
                  openDetail: true,
                  label: 'view',
                  detailId: item.id,
                });
              }}
            />
          ) : (
            <HCMTable
              withEnableEdit
              rowSelection={undefined}
              columns={TABLE_DEFAULT_COLUMNS}
              data={probation}
              itemActions={hasPermission && tableItemActions}
              onChangePageConfig={onChangePageConfig}
              actionPayload={payload}
              onRowClick={(item, i) => {
                this.setState({
                  index: i,
                  openDetail: true,
                  label: 'view',
                  detailId: item.id,
                });
              }}
            />
          )}
        </div>
)}
        </Permission>
        {label === 'view' && (
          <Detail
            open={openDetail}
            id={detailId}
            enableEdit={employeesList && employeesList.content && (employeesList.content.find(({id}) => id === detailId) || {}).enableEdit}
            onClose={() => {
              onRefresh();
              this.setState({
                openDetail: false,
                detailId: undefined,
              });
            }}
            switchPrev={
              index === 0
                ? null
                : () => {
                    // 切换到上一个id，如没有则不传该属性
                    this.changeToPrevId();
                  }
            }
            switchNext={
              index < len - 1
                ? () => {
                    // 切换到下一个id，如没有则不传该属性
                    this.changeToNextId();
                  }
                : null
            }
          />
        )}
        {label === 'transfer' && (
          <TransferModal
            id={detailId}
            visible={label === 'transfer'}
            onSave={() => {
              onRefresh();
              this.clearState();
            }}
            onCancel={() => {
              onRefresh();
              this.clearState();
            }}
          />
        )}
        {label === 'resignation' && (
          <ResignationModal
            id={detailId}
            visible={label === 'resignation'}
            onSave={() => {
              onRefresh();
              this.clearState();
            }}
            onCancel={() => {
              onRefresh();
              this.clearState();
            }}
          />
        )}
      </div>
    );
  }
}

export default OnBoardStaffs;
