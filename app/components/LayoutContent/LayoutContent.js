import React, { Component } from 'react';
import { Layout } from 'antd';
import styles from './LayoutContent.less';

const { Content } = Layout;

export default class LayoutContent extends Component {
  render() {
    return <Content className={styles.main} {...this.props} />;
  }
}
