import React from 'react';
// import { Spin } from 'antd';
import { Loading } from 'components/Base';
import styles from './Spinner.less';

class Spinner extends React.Component {
  render() {
    return (
      <div className={styles.spinner}>
        <Loading visible center />
      </div>
    );
  }
}

export default Spinner;
