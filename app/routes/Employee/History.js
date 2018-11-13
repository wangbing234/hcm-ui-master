import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Spin } from 'antd';
import { actions } from 'models/employee';
import styles from './History.less';

const { GET_EMPLOYEE_HISTORY_INFO } = actions;

@connect(({ employee = {}, loading }) => ({
  loading: loading.models.employee,
  ...employee,
}))
class History extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { dispatch, id } = this.props;
    GET_EMPLOYEE_HISTORY_INFO(dispatch, { payload: id }); // TODO
  }

  renderItem = (item, index) => {
    const { content, date, remark } = item;
    const key = index + content;
    return (
      <div key={key} className={styles.itemWrapper}>
        <span className={styles.content}>{content}</span>
        <span className={styles.date}>{date}</span>
        {remark ? (
          <div className={styles.remark} title={remark}>
            {remark}
          </div>
        ) : null}
      </div>
    );
  };

  render() {
		const { employeeHistory, loading } = this.props;
		if (loading) {
			return (<div className={styles.loading}><Spin /></div>);
		}
		if (employeeHistory && employeeHistory.length > 0) {
			return (<div className={styles.wrapper}><span className={styles.header}>历史记录</span>{employeeHistory.map((item, index) => this.renderItem(item, index))}</div>);
		} else {
			return null;
		}
	}

}

export default History;
