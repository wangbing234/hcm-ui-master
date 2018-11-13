import React, { Component } from 'react';
import withFetch from 'decorators/withFetch';
import { getFirstLetterImg } from 'utils/pinyinUtil';
import HCMTable from 'components/HCMTable';
import { actions } from 'models/getEmployees';
import { TABLE_DEFAULT_COLUMNS } from 'constants/getEmployees';
import { Loading } from 'components/Base';
import moment from 'moment';
import Header from './Header';

import styles from '../Employee.less';

import Deatil from '../Detail';

const { GET_RESIGNED_EMPLOYEES } = actions;

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

const TABLE_COLUMNS = TABLE_DEFAULT_COLUMNS.concat(
  {
    title: '离职日期',
    dataIndex: 'resignationDate',
  },
  {
    title: '离职原因',
    dataIndex: 'resignationReason',
    render: (text) => (
      <div className={styles.column}>
        {text}
      </div>
    ),
  }
);

const EmployeesListTable = withFetch(GET_RESIGNED_EMPLOYEES, state => ({
  data: state.getEmployees.resignedEmployees,
}))(HCMTable);

class ResignedEmployees extends Component {
  state = {
    index: undefined,
    // label: 'view',
    openDetail: false,
    detailId: undefined,
  };

  onChange = key => {
    const { onChange } = this.props;
    onChange(key);
  };

  changeToNextId = () => {
    const { index } = this.state;
    const { resignedEmployees } = this.props;
    const { id } = resignedEmployees.content[index + 1];
    this.setState({
      index: index + 1,
      detailId: id,
    });
  };

  changeToPrevId = () => {
    const { index } = this.state;
    const { resignedEmployees } = this.props;
    const { id } = resignedEmployees.content[index - 1];
    this.setState({
      index: index - 1,
      detailId: id,
    });
  };

  clearState = () => {
    this.setState({ key: null });
  };

  render() {
    const {
      payload,
      onChangePageConfig,
      changeState,
      resignedEmployees,
      onRefresh,
      loading,
    } = this.props;

    const { openDetail, detailId, index } = this.state;
    const len = resignedEmployees !== null ? resignedEmployees.content.length : 0;
    if (len !== 0) {
      const lists = resignedEmployees.content;
      lists.forEach(_item => {
        const item = _item;
        const data = item.resignationDate;
        item.resignationDate = moment(data).format('YYYY-MM-DD');
      });
      resignedEmployees.content = lists;
    }
    return (
      <div className={styles.container}>
        <div className={styles.HCM_body}>
          <Header className={styles.HCM_body} changeState={changeState} {...this.state} />
        </div>
        <div className={styles.listTable}>
          <Loading visible={loading} center />
          <EmployeesListTable
            rowSelection={undefined}
            columns={TABLE_COLUMNS}
            onChangePageConfig={onChangePageConfig}
            actionPayload={payload}
            onRowClick={(item, i) => {
              this.setState({
                index: i,
                detailId: item.id,
                openDetail: true,
              });
            }}
          />
        </div>
        <Deatil
          open={openDetail}
          id={detailId}
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
      </div>
    );
  }
}

export default ResignedEmployees;
