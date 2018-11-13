import React, { Component } from 'react'
import { Table } from 'antd'
import styles from './InsuranceSetting.less'

const { Column } = Table;

class ProgramTable extends Component{

  handelDelItem = (id) => {
    const {modalName, handelDelItem} = this.props
    handelDelItem(id, modalName)
  }

  handelEditItem = (record) => {
    const {modalName, handelEditItem} = this.props
    handelEditItem(record, modalName)
  }

  renderAction = (text, record) => {
    return (
      <div>
        <a className={styles.deleteBtn} onClick={() => {this.handelDelItem(record.id)}}>删除</a>
        <a className={styles.editBtn} onClick={() => {this.handelEditItem(record)}}>修改</a>
      </div>
    )
  }

  render() {
    const {data} = this.props
    return (
      <div className={styles.schemeList}>
        <Table
        size="middle"
        rowKey="id"
        dataSource={data}
        showHeader={false}
        pagination={false}
        rowClassName={styles.schemeList}
        >
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="操作" dataIndex="action" key="action" className={styles.actions} render={this.renderAction} />
        </Table>
      </div>
    )
  }
}

export default ProgramTable
