import React, { Component } from 'react';
import { connect } from 'dva';
import { actions } from 'models/personnel';
import Personnel from './PersonnelContainer';
import styles from './personnel.less';

const { GET_PERSONNEL } = actions;
@connect(state => ({
  state,
  data: state.personnel.personnelList,
}))
class CusHumanField extends Component {
  constructor(props) {
    super(props);
    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };
  }

  componentDidMount() {
    this.fetchDataSource();
  }

  onRefresh = () => this.dispatch(GET_PERSONNEL);

  fetchDataSource = () => {
    this.dispatch(GET_PERSONNEL, {});
  };

  render() {
    const { ...props } = this.props;
    return (
      <div className={styles.table}>
        <Personnel title="岗位信息" {...props} onRefresh={this.onRefresh} />
        <Personnel title="基本信息" {...props} onRefresh={this.onRefresh} />
        <Personnel title="其他信息" {...props} onRefresh={this.onRefresh} />
      </div>
    );
  }
}

export default CusHumanField;
