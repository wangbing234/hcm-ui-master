import React, { Component } from 'react'
import {connect} from 'dva'
import { Button, Loading } from 'components/Base'
import { actions } from 'models/settingInsuranceSetting'
import { message } from 'antd'
import { confirm } from 'components/Confirm';
import classnames from 'classnames';
import { createPromiseDispatch } from 'utils/actionUtil';
import { SOCIAL_SECURITY_PLAN_CONFIG, HOUSING_FUND_PLAN_CONFIG } from 'constants/salary'
import { isEmpty } from 'lodash';
import SocialSecurityModal from './SocialSecurityModal'
import HousingFundModal from './HousingFundModal'
import ProgramTable from './ProgramTable'
import styles from './InsuranceSetting.less'

const {
  GET_SOCIAL_SECURITY_PLANS,
  GET_HOUSING_FUND_PLANS,
  UPDATE_SOCIAL_SECURITY_SCHEME,
  UPDATE_HOUSING_FUND_PLANS,
  DELETE_SOCIAL_SECURITY_PLAN,
  DELETE_HOUSING_FUND_PLAN,
 } = actions

// const { Column } = Table;


@connect(({settingInsuranceSetting, loading}) => ({
  listLoading: loading.models.settingInsuranceSetting,
  ...settingInsuranceSetting,
}))

class insuranceSetting extends Component{

  state = {
    socialModalStatus: false,
    housingModalStatus: false,
  }

  componentDidMount(){
    const {dispatch} = this.props
    GET_SOCIAL_SECURITY_PLANS(dispatch, { payload: {}})
    GET_HOUSING_FUND_PLANS(dispatch,{ payload: {}})
  }

  promiseDispatch = createPromiseDispatch();

  closeModal = (modalName) => {
    const {dispatch} = this.props
    this.setState({[modalName]: false}, () => {
      GET_SOCIAL_SECURITY_PLANS(dispatch, { payload: {}})
      GET_HOUSING_FUND_PLANS(dispatch,{ payload: {}})
    })
  }

  handelDelItem = (id, modalName) => {
    const { dispatch } = this.props;
    const name = modalName !== 'socialModalStatus' ? '公积金方案' : '社保方案'
    confirm({
      title: `删除${name}项?`,
      content: `确定要删除该${name}吗? (删除之后无法恢复)`,
      centered: true,
      onOk: () => {
        return this.promiseDispatch(modalName === 'socialModalStatus' ? DELETE_SOCIAL_SECURITY_PLAN : DELETE_HOUSING_FUND_PLAN, id)
        .then(() => {
          GET_SOCIAL_SECURITY_PLANS(dispatch, { payload: {}})
          GET_HOUSING_FUND_PLANS(dispatch,{ payload: {}})
        })
        .catch(err => {
          if (err.meta) {
            message.error(err.meta.message);
          }
        })
      },
    });
  }

  handelAddItem = (modalName) => {
    const {dispatch} = this.props;
    this.setState({[modalName]: true}, () => {
      return modalName === 'socialModalStatus'
      ? UPDATE_SOCIAL_SECURITY_SCHEME(dispatch, {payload: {...SOCIAL_SECURITY_PLAN_CONFIG}})
      : UPDATE_HOUSING_FUND_PLANS(dispatch, {payload: {...HOUSING_FUND_PLAN_CONFIG}})
    })
  }

  handelEditItem = (record, modalName) => {
    const {dispatch} = this.props;
    this.setState({[modalName]: true}, () => {
      return modalName === 'socialModalStatus'
      ? UPDATE_SOCIAL_SECURITY_SCHEME(dispatch, {payload: {...record}})
      : UPDATE_HOUSING_FUND_PLANS(dispatch, {payload: {...record}})
    })
  }

  render() {
    const { socialModalStatus, housingModalStatus } = this.state
    const { socialSecuritySchemeList, providentFundSchemeList, listLoading } = this.props
    return (
      <div className={styles.payroll}>
        <div>
          <Loading visible={listLoading} center />
          <div className={classnames('global-setting-title', styles.content)}>社保</div>
          {!isEmpty(socialSecuritySchemeList) ? (
            <ProgramTable data={socialSecuritySchemeList} modalName='socialModalStatus' handelEditItem={this.handelEditItem} handelDelItem={this.handelDelItem}  />
          ) : null}
          <Button
            className={styles.addBtn}
            icon="plus"
            display="block"
            onClick={() => this.handelAddItem('socialModalStatus')}
          >
            添加社保方案
          </Button>
        </div>
        <div>
          <div className={classnames('global-setting-title', styles.content)}>公积金</div>
          {!isEmpty(providentFundSchemeList) ? (
            <ProgramTable data={providentFundSchemeList} modalName='housingModalStatus' handelEditItem={this.handelEditItem} handelDelItem={this.handelDelItem}  />
          ) : null}
          <Button
            className={styles.addBtn}
            icon="plus"
            display="block"
            onClick={() => this.handelAddItem('housingModalStatus')}
          >
            添加公积金方案
          </Button>
        </div>
        <SocialSecurityModal socialModalStatus={socialModalStatus} closeModal={this.closeModal} {...this.props} />
        <HousingFundModal housingModalStatus={housingModalStatus} closeModal={this.closeModal} {...this.props} />
      </div>
    )
  }
}

export default insuranceSetting
