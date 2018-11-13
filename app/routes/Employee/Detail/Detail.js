import React, { PureComponent } from 'react';
import classnames from 'classnames';

import { DETAIL_MAP_LAYOUT } from 'constants/employee';
import { PERMISSION_CODE } from 'constants/permission';

import { getFirstLetterImg } from 'utils/pinyinUtil';

import Button from 'components/Base/Button';
import { fieldValueStrategy } from 'components/Biz/ConfigableField/Layout';
import Tabs from 'components/Tabs';

import Avatar from './Avatar';
import { Session } from './SessionInfo';
import HeaderInfo from './HeaderInfo';
import StandardInfoCard from './StandardInfoCard';
import Permission from './Permission';

import styles from './Detail.less';

function EmployeeHeader({ isView, data, error, onEdit, onCancel, onSave, onChange  }) {
  if (isView) {
    const { name, gender, birthday, employeeNo, mobile, avatar } = data.toJS();
    return (
      <header className={styles.header}>
        <Avatar isView value={avatar || getFirstLetterImg(name)} />
        <div className={styles.headerContent}>
          <div className={styles.headerName}>{name}</div>
          <span>{gender === 'female' ? '女' : '男'}</span>
          <span className={styles.separator}>|</span>
          <span>{birthday}</span>
          <span className={styles.separator}>|</span>
          <span>{`工号：${employeeNo}`}</span>
          <span className={styles.separator}>|</span>
          <span>{`手机号：${mobile}`}</span>
        </div>
        <Permission code={PERMISSION_CODE.EMPLOYEE_MANAGE}>
          <Button onClick={onEdit} className={styles.headerIcon}>
            <i className="icon-edit" />
          </Button>
        </Permission>
      </header>
    );
  } else {
    return (
      <Session title="员工入职" className={styles.editHeader}>
        <HeaderInfo data={data} error={error} onChange={onChange} />
        <div className={styles.headerActions}>
          {
            <Button onClick={onCancel} style={{ marginRight: 10 }}>
              取消
            </Button>
          }
          {
            <Button type="primary" className={styles.cardButton} onClick={onSave}>
              保存
            </Button>
          }
        </div>
      </Session>
    );
  }
}

const POSITION_PATH = ['positionInfo', 'position'];

export default class Detail extends PureComponent {
  state = {
    tabKey: 'positionInfo',
    editCards: [],
  };

  onTrash = (id, idx) => {
    const { onTrash } = this.props;
    const { tabKey } = this.state;
    onTrash(tabKey, id, idx);
  };

  onPlus = id => {
    const { onPlus } = this.props;
    const { tabKey } = this.state;
    onPlus(tabKey, id);
    this.onEdit(id);
  };

  onEdit = id => {
    const { editCards } = this.state;
    this.setState({
      editCards: [id].concat(editCards),
    });
  };

  onCancel = id => {
    const { onCancel } = this.props;
    const { tabKey } = this.state;
    this.cancelEdit(id);
    onCancel(tabKey, id);
  };

  onCancelHeader = () => {
    this.onCancel('header');
  };

  onSaveHeader = () => {
    const { onUpdate } = this.props;
    onUpdate('header').then((err) => {
      if(!err) {
        this.cancelEdit('header');
      }
    });
  };

  onSave = id => {
    const { onUpdate } = this.props;
    const { tabKey } = this.state;
    onUpdate(tabKey, id).then((err) => {
      if(!err) {
        this.cancelEdit(id);
      }
    }).catch(() => {});
  };

  onChangeWithSession = (id, idx, code, value) => {
    const { onChangeWithSession } = this.props;
    const { tabKey } = this.state;
    onChangeWithSession(tabKey, id, idx, code, value);
  };

  getDataFromPath = path => {
    const { data } = this.props;
    return data.getIn(path);
  };

  getFieldValue = fieldValueStrategy({
    company: (data, config, idx) => this.getDataFromPath(POSITION_PATH.concat([idx, 'companyName'])),
    department: (data, config, idx) => this.getDataFromPath(POSITION_PATH.concat([idx, 'departmentName'])),
    position: (data, config, idx) => this.getDataFromPath(POSITION_PATH.concat([idx, 'positionName'])),
    grade: (data, config, idx) => this.getDataFromPath(POSITION_PATH.concat([idx, 'gradeName'])),
    leader: (data, config, idx) => this.getDataFromPath(POSITION_PATH.concat([idx, 'leaderName'])),
  });

  cancelEdit = id => {
    const { editCards } = this.state;
    this.setState({
      editCards: editCards.filter(key => key !== id),
    });
  };

  render() {
    const { data, error, layout, companyTree, onChangeWithHeader } = this.props;
    const { tabKey, editCards } = this.state;
    const isHeaderView = !~editCards.indexOf('header');
    return (
      <div
        className={classnames(styles.detail, {
          [styles.detailsEdit]: !isHeaderView,
        })}
      >
        <EmployeeHeader
          isView={isHeaderView}
          data={data.get('header')}
          error={(error || {}).header}
          onEdit={() => {
            this.onEdit('header');
          }}
          onCancel={this.onCancelHeader}
          onChange={onChangeWithHeader}
          onSave={this.onSaveHeader}
        />
        <Tabs
          value={tabKey}
          tabs={[
            {
              key: 'positionInfo',
              title: '岗位信息',
            },
            {
              key: 'basicInfo',
              title: '基本信息',
            },
            {
              key: 'otherInfo',
              title: '其他信息',
            },
          ]}
          onChange={key => this.setState({ tabKey: key, editCards: [] })}
        />

        <div style={{ padding: 20, backgroundColor: '#f9f9f9' }}>
          {layout[DETAIL_MAP_LAYOUT[tabKey]].map(({ id, ...cardProps }) => {
            const isView = !~editCards.indexOf(id);
            return (
              <Permission >
                {hasPermission => (
                <StandardInfoCard
                  isView={isView}
                  key={id}
                  id={id}
                  data={(data.getIn([tabKey, `${id}`]) || [])}
                  error={((error || {})[tabKey] || {})[id]}
                  onEdit={hasPermission && isView && this.onEdit}
                  onTrash={hasPermission && !isView && this.onTrash}
                  onPlus={hasPermission && this.onPlus}
                  onCancel={hasPermission && !isView && this.onCancel}
                  onSave={hasPermission && !isView && this.onSave}
                  onChange={this.onChangeWithSession}
                  companyTree={companyTree}
                  getFieldValue={this.getFieldValue}
                  {...cardProps}
                />
                )}
              </Permission>
            );
          })}
        </div>
      </div>
    );
  }
}
