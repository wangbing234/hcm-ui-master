import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import styles from './MainTab.less';

const { TabPane } = Tabs;

class MainTabs extends React.Component {
  static propTypes = {
    title: PropTypes.array.isRequired,
  };

  onChange = key => {
    const { onChange } = this.props;
    onChange(key);
  };

  render() {
    const { title, defaultActiveKey } = this.props;
    return (
      <Tabs defaultActiveKey={defaultActiveKey} className={styles.tab} onChange={this.onChange}>
        {title.map((item, key) => <TabPane tab={item.value} key={item.key} index={key} />)}
      </Tabs>
    );
  }
}

export default MainTabs;
