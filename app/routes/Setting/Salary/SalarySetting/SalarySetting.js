import React, { Component } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import { Table, message } from 'antd';
import { Button, Loading} from 'components/Base';
import { confirm } from 'components/Confirm';
import { createPromiseDispatch } from 'utils/actionUtil';
import { NAMESPACE, ACTION_NAMES, actions } from 'models/settingSalarySetting';
import { SALARY_TYPES_ENUM } from 'constants/salary';
import SalaryModal from './SalaryModal';
import styles from './SalarySetting.less';

const { Column } = Table;

const {
  FETCH_SALARY_LIST,
  DEL_SALARY_ITEM,
  FETCH_SALARY_OPTION,
  SAVE_SALARY_FORM,
} = actions;

@connect(({ settingSalarySetting, loading, error }) => {
  return {
    error: error.settingSalarySetting,
    listLoading: loading.effects[`${NAMESPACE}/${ACTION_NAMES.FETCH_SALARY_LIST}`],
    ...settingSalarySetting,
  }
})
class SalarySetting extends Component {

  state = {
    editingSalaryData: {},
  }

  componentDidMount() {
    this.fetchSalaryList();
    this.fetchSalaryOption();
  }

  promiseDispatch = createPromiseDispatch();

  // 保存表单
  handleSaveForm = (values) => {
    const data = {...values};
    const formula = this.handleFormatFormula(data.formula);
    data.formula = formula;
    return this.promiseDispatch(SAVE_SALARY_FORM, data)
    .then(() => {
      this.updateEditingData().fetchSalaryList();
    })
  }

  // 将 HTML 转化成公式
  handleFormatFormula(htmlString) {
    const { salaryOption } = this.props;
    const reg = /<code contenteditable="false" class="var">(\S)+<\/code>/g;
    // 通过name找到对应的code
    const getCodeByName = (name) => {
      const result = salaryOption.find(option => {
        return option.name === name;
      });
      if (result) {
        return result.code;
      }
    }
    const result = htmlString.replace(reg, matched => {
      const node = document.createElement('div');
      node.innerHTML = matched;
      const name = node.textContent.trim();
      return getCodeByName(name);
    }).replace('<br>', '');
    return result;
  }

  // 删除薪资项
  handelDelItem = (id) => {
    confirm({
      title: '删除薪资项?',
      content: '确定要删除该薪资项吗? (删除之后无法恢复)',
      centered: true,
      onOk: () => {
        return this.promiseDispatch(DEL_SALARY_ITEM, id)
        .then(this.fetchSalaryList)
        .catch(err => {
          if (err.meta) {
            message.error(err.meta.message);
          }
        })
      },
    });
  }

  // 编辑薪资项
  handelEditItem = (data) => {
    this.updateEditingData(data);
  }

  // 新建薪资项
  handelNewItem = () => {
    const data = {
      display: true,
      name: "",
      type: "",
      pointScale: "",
      pointRule: "",
      formula: "",
    };
    this.updateEditingData(data);
  }

  // 更新编辑的数据
  updateEditingData = (data={}) => {
    this.setState({ editingSalaryData: data });
    return this;
  }

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };

  // 获取薪资计算选项
  fetchSalaryOption = () => {
    this.dispatch(FETCH_SALARY_OPTION);
  }

  // 获取薪资项列表
  fetchSalaryList = () => {
    this.dispatch(FETCH_SALARY_LIST);
  }

  // 渲染操作按钮
  renderAction = (text, record) => {
    const { deletable, editable, ...rest } = record;
    return (
      <div>
        {deletable && <a className={styles.deleteBtn} onClick={() => {this.handelDelItem(record.id)}}>删除</a>}
        {editable && <a className={styles.editBtn} onClick={() => {this.handelEditItem(rest)}}>修改</a>}
      </div>
    )
  }

  render() {
    const { editingSalaryData } = this.state;
    const { salaryList, salaryOption, listLoading } = this.props;
    return (
      <div className={styles.main}>
        <h6 className={classnames('global-setting-title', styles.title)}>薪资项</h6>
        <Loading visible={listLoading} center />
        <Table
          size="middle"
          rowKey="id"
          pagination={false}
          showHeader={false}
          dataSource={salaryList}
        >
          <Column width="25%" title="薪资项名称" dataIndex="name" key="name" />
          <Column width="35%" title="类型" dataIndex="type" key="type" render={(text, record) => {return SALARY_TYPES_ENUM[record.type]}} />
          <Column width="15%" title="是否显示" dataIndex="display" key="display" render={(text) => {return text === true ? '显示' : '不显示'}} />
          <Column width="25%" title="操作" dataIndex="action" key="action" className={styles.actions} render={this.renderAction} />
        </Table>
        <Button
          onClick={() => {this.handelNewItem({})}}
          className={styles.addBtn}
          icon="plus"
          display="block"
        >
          添加薪资项
        </Button>
        {
          <SalaryModal
            visible={!isEmpty(editingSalaryData)}
            onOk={(values) => this.handleSaveForm(values)}
            onCancel={() => this.updateEditingData()}
            data={editingSalaryData}
            salaryOption={salaryOption}
          />
        }
      </div>
    )
  }
}

export default SalarySetting;
