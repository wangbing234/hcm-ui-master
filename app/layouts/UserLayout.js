import React, { Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import Brand from 'components/Biz/Brand/';
import Login from '../routes/Login';

import styles from './UserLayout.less';

class UserLayout extends Component {
  pageTitle = '登录 - 有招';

  render() {
    return (
      <DocumentTitle title={this.pageTitle}>
        <div className={styles.container}>
          <Brand text="HCM" className={styles.logo} />
          <Login {...this.props} />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { login, error, loading } = state;
  return {
    error,
    loading,
    ...login,
  };
}

export default connect(mapStateToProps)(UserLayout);
