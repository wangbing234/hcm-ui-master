import React, { Component } from 'react'
import { Button, Loading, DatePicker, Select } from 'components/Base';
// import {Select} from 'antd'
import { connect } from 'dva'
import classnames from 'classnames';
import { createPromiseDispatch } from 'utils/actionUtil';
import { actions } from 'models/settingPayrollSetting'
import FormBox from 'components/FormBox';
import { Row } from 'layouts/FormLayout';
import styles from './PayrollSetting.less'

const { Option } = Select;
const { MonthPicker } = DatePicker
const data = [];
for(let i = 1; i < 29; ){
  data.push({key: i, val: i})
  i += 1;
};
const {GET_SALARIES_CONFIG, CYCLE_DATE_SETTING, PAY_DATE_SETTING} = actions
@connect(({settingPayrollSetting, loading}) => {
  return {
    loading: loading.models.settingPayrollSetting,
    payDate: settingPayrollSetting.salaryPayDate,
    payMonth: settingPayrollSetting.salaryPayMonth,
    cycleDate: settingPayrollSetting.startCycleDay,
  }
})
class payrollSetting extends Component{

  state = {
    isSetting: false,
    isChangePayData: false,
    // complete: false,
    startCycleDay: 1, // 计薪开始日期
    firstCycleMonth: '', // 计薪开始日期
    salaryPayDate: '', // 发薪日期
    salaryPayMonth: '', // 发薪月份（默认为次月）
  }

  componentDidMount() {
    const {dispatch} = this.props
    GET_SALARIES_CONFIG(dispatch, {payload: {}})
  }

  promiseDispatch = createPromiseDispatch();

  handleStartDay = (val) => {
    this.setState({startCycleDay: val})
  }

  handleSalayCycle = (val, dateString) => {
    this.setState({firstCycleMonth: dateString})
  }

  changeSettingState = () => {
    this.setState({isSetting: true})
  }

  cancelSetting = () => {
    this.setState({isSetting: false})
  }

  toggleChange = () => {
    const {isChangePayData} = this.state;
    this.setState({isChangePayData: !isChangePayData})
  }

  saveChange = () => {
    this.setState({isChangePayData: false})
    const { salaryPayDate, salaryPayMonth } = this.state
    const { dispatch } = this.props
    this.promiseDispatch(PAY_DATE_SETTING, {salaryPayDate, salaryPayMonth})
    .then(() => {
      GET_SALARIES_CONFIG(dispatch, {payload: {}})
    })
  }

  handlePayDate = (val) => {
    this.setState({salaryPayDate: val})
  }

  handlePayMonth = (val) => {
    this.setState({salaryPayMonth: val})
  }

  doneSetting = () => {
    const {startCycleDay, firstCycleMonth} = this.state
    const {dispatch} = this.props
    this.setState({
      isSetting: false,
    }, () => {
      this.promiseDispatch(CYCLE_DATE_SETTING, {
        firstCycleMonth,
        startCycleDay,
      })
      .then(() => {
        GET_SALARIES_CONFIG(dispatch, {payload: {}})
      })
    })
  }

  render() {
    const {isChangePayData, isSetting, startCycleDay, salaryPayDate} = this.state
    const { payDate, cycleDate, loading, payMonth } = this.props
    const payDay = payDate !== null ? payDate : salaryPayDate
    const showDate = startCycleDay === 1 ? 30 : startCycleDay - 1;
    const month = payMonth !== 'current' ? '次' : '本'

    return (

      <div className={styles.payroll}>
        <Loading visible={loading} center />
        <div className={classnames('global-setting-title', styles.content)}>计薪周期</div>
        <div className={styles.dataLine}>
          {cycleDate ? (
            <div>
              <div className={styles.beginData}>{`上月${cycleDate}日`}</div>
              <span className={styles.font}>至</span>
              <div className={styles.endData}>{`当月${cycleDate - 1}日`}</div>
            </div>
          ) : (
            <div>
              <span className={styles.setting} onClick={this.changeSettingState}>设置</span>
              <span className={styles.noModify}>计薪周期一旦设置以后将无法修改</span>
            </div>
          )}
        </div>
        {isSetting && (
          <div style={{marginTop: 10}}>
            <Row cols={3}>
              <div className={styles.selectDate}>
                <FormBox label={`开始日期 (至次月${showDate}日)`}>
                  <Select onChange={this.handleStartDay}>
                    {
                      data.map(({val, key}) => (<Option key={key} value={val}>{val}</Option>))
                    }
                  </Select>
                </FormBox>
              </div>
              <div className={styles.datePicker}>
                <FormBox label='首次薪资核算开始月份' style={{width: '100%', padding: '0 10px'}}>
                  <MonthPicker style={{width: '100%'}} onChange={this.handleSalayCycle} />
                </FormBox>
              </div>
              <FormBox>
                <div style={{float: 'right', color: 'rgba(51,125,188,1)', cursor: 'pointer'}} onClick={this.cancelSetting}>取消</div>
                <Button type='primary-light' className={styles.button} onClick={this.doneSetting}>确定</Button>
              </FormBox>
            </Row>
          </div>
        )}
        <div>
          <div className={classnames('global-setting-title', styles.content)}>发薪日</div>
          <div className={styles.dataLine}>
            {!isChangePayData ? (
              <div>
                <span className={styles.setting} onClick={this.toggleChange}>修改</span>
                <span>{`${month}月${payDay}号`}</span>
              </div>
            ) : (
                <div className={styles.paySalary}>
                  <Row cols={3}>
                    <div className={styles.paySalary}>
                      <FormBox label='发薪月'>
                        <Select onChange={this.handlePayMonth}>
                          <Option key='current' value='current'>本月</Option>
                          <Option key='next' value='next'>次月</Option>
                        </Select>
                      </FormBox>
                    </div>
                    <div className={styles.datePicker}>
                      <FormBox label='发薪日'>
                        <Select onChange={this.handlePayDate}>
                          {
                            data.map(({val, key}) => (<Option key={key} value={val}>{val}</Option>))
                          }
                        </Select>
                      </FormBox>
                    </div>
                    <FormBox>
                      <div style={{float: 'right', color: 'rgba(51,125,188,1)', cursor: 'pointer'}} onClick={this.toggleChange}>取消</div>
                      <Button type='primary-light' className={styles.button} onClick={this.saveChange}>确定</Button>
                    </FormBox>
                  </Row>
                </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
export default payrollSetting
