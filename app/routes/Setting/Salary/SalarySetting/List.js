import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'components/Base';
import styles from './List.less';

class List extends Component {

  static propTypes = {
    dataSource: PropTypes.array.isRequired, // 数据
    onInsert: PropTypes.func, // 插入字段回调
  };

  static defaultProps = {
    onInsert: () => {},
  }

  state = {
    selectedItem: null,
  }

  // 插入字段
  handleInsert = () => {
    const { selectedItem } = this.state;
    const { onInsert } = this.props;
    onInsert(selectedItem);
  }

  // 点击选择
  handleClick = (item) => {
    this.setState({selectedItem: item});
  }

  render() {
    const { selectedItem } = this.state;
    const { dataSource, disabled } = this.props;

    return (
      <div className={styles.wrapper}>
        <div className={styles.list}>
          <h6>字段</h6>
          <ul>
            {
              dataSource.map(item => (
                <li
                  className={classNames({
                    [styles.selected]: selectedItem && (selectedItem.name === item.name),
                  })}
                  key={item.id}
                  onClick={() => { this.handleClick(item)}}
                >{item.name}</li>
              ))
            }
          </ul>
      </div>
      <Button disabled={!selectedItem || disabled} onClick={this.handleInsert} className={styles.btn}>插入字段</Button>
    </div>
    )
  }
}

export default List;
