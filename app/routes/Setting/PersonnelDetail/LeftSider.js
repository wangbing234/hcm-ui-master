import React, { Component } from 'react';
import { Layout } from 'antd';
import { Input } from 'components/Base/';
import { FIELD_TYPE, FIELD_ICON } from 'constants/field';
import DragField from './DragField';
import styles from './LeftSider.less';

const { Sider } = Layout;
const { Search } = Input;

// 将字段信息常量组合成列表
function mapTypesAndIcons2List(types) {
  return icons => key => ({
    fieldType: key,
    label: types[key],
    icon: icons[key],
  });
}

// 控件列表数据
const lists = Object.keys(FIELD_TYPE).map(mapTypesAndIcons2List(FIELD_TYPE)(FIELD_ICON));

// 搜索控件
const filterListByValue = value => {
  return lists.filter(item => {
    return item.label.indexOf(value) !== -1;
  });
};

class LeftSider extends Component {
  state = {
    searchValue: '',
  };

  handleSearch = value => {
    this.setState({ searchValue: value });
  };

  render() {
    const { searchValue } = this.state;
    const { onEndDrag } = this.props;
    const filteredList = filterListByValue(searchValue);

    return (
      <Sider className={styles.main} theme="light" width={180}>
        <h6 className={styles.header}>控件库</h6>
        <Search
          shadow
          onInput={e => {
            this.handleSearch(e.target.value);
          }}
          onSearch={this.handleSearch}
          className={styles.search}
          placeholder="搜索控件"
        />
        <div className={styles.lists}>
          {filteredList.map(item => (
            <DragField key={item.fieldType} onEndDrag={onEndDrag} info={item} />
          ))}
        </div>
      </Sider>
    );
  }
}

export default LeftSider;
