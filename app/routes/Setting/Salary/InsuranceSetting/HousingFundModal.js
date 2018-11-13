import React, { Component } from 'react'
import * as Yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment'
import Modal from 'components/Base/Modal';
import { createPromiseDispatch } from 'utils/actionUtil';
import { SALARY_SCALE_RULES, SALARY_POINT_RULES, HOUSING_FUND_PLAN_CONFIG } from 'constants/salary'
import { actions } from 'models/settingInsuranceSetting'
import FormBox from 'components/FormBox'
import { Button, Input, Select, DatePicker } from 'components/Base'
import { Layout, SplitRow } from 'layouts/FormLayout';
import { Tooltip } from 'antd'
import styles from './InsuranceSetting.less'


const { Option } = Select

const data = [];
for(let i = 1; i < 31; ){
  data.push({key: i, label: i})
  i += 1;
};

function getFieldFromMeta(meta) {
  let field = '';
  switch(meta.code) {
    case '17002':
    field = 'name';
    break;
    default:
    break;
  }
  return field;
}

const {
  GET_HOUSING_FUND_PLANS,
  SAVE_HOUSING_FUND_PLANS,
  HOUSING_FUND_FIELD_CHANGE,
} = actions



class HousingFundModal extends Component{

  promiseDispatch = createPromiseDispatch();

  handleCancel = () => {
    const {closeModal, dispatch} = this.props
    HOUSING_FUND_FIELD_CHANGE(dispatch, {payload: {...HOUSING_FUND_PLAN_CONFIG}})
    closeModal('housingModalStatus')
  }

  render() {
    const { providentFundScheme, housingModalStatus } = this.props
    return(
      <Formik
        enableReinitialize
        initialValues={providentFundScheme}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required('该字段必填'),
            limitPoint: Yup.string().required('该字段必填'),
            effectDate: Yup.string().nullable(true).required('该字段必填'),
            pointRule: Yup.string().required('该字段必填'),
            pointScale: Yup.string().required('该字段必填'),
            limitUp: Yup.number().typeError('请输入数字').required('该字段必填'),
            limitDown: Yup.number().typeError('请输入数字').lessThan(Yup.ref('limitUp'), '下限值不能大于下限值').required('该字段必填'),
            fundEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            fundPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            fundAddingEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            fundAddingPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
          })
        }
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const {dispatch, closeModal} = this.props;
          return this.promiseDispatch(SAVE_HOUSING_FUND_PLANS, values)
          .then(() => {
            GET_HOUSING_FUND_PLANS(dispatch, { payload: {}})
            HOUSING_FUND_FIELD_CHANGE(dispatch, {payload: {...HOUSING_FUND_PLAN_CONFIG}})
            closeModal('housingModalStatus')
          })
          .catch(err => {
            if (err.meta) {
              const field = getFieldFromMeta(err.meta);
              setFieldError(field, err.meta.message);
            }
          })
          .finally(() => {
            setSubmitting(false);
          })
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isSubmitting,
        }) => {
          return (
            <Modal
              visible={housingModalStatus}
              title={providentFundScheme.id === undefined ? '新增公积金方案' : '编辑公积金方案'}
              onCancel={this.handleCancel}
              footer={
                <div>
                  <Button onClick={this.handleCancel}>
                    取消
                  </Button>
                  <Button
                    // disabled={!disable}
                    type="primary"
                    key="inactive"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    保存
                  </Button>
                </div>
              }
            >
            <Layout >
              <FormBox
                errorMsg={errors.name && touched.name && errors.name}
                label='公积金方案名称'
                isRequired
                className={styles.bottom}
              >
                <Input
                  onBlur={() => {setFieldTouched('name', true)}}
                  onChange={e => {setFieldValue('name', e.target.value)}}
                  value={values.name}
                />
              </FormBox>
            </Layout>
            <Layout>
              <SplitRow className={styles.bottom}>
                <FormBox
                  errorMsg={errors.limitPoint && touched.limitPoint && errors.limitPoint}
                  isRequired
                  className={styles.bottom}
                  label={
                  <span className={styles.lableTitle}>
                    入离职缴纳临界点（含）
                    <Tooltip
                      title={`每月${values.limitPoint}日前入职缴纳公积金，${values.limitPoint + 1}日及以后入职不缴纳公积金 每月${values.limitPoint}日前离职不缴纳公积金，${values.limitPoint + 1}日及以后离职缴纳公积金`}
                      placement="right"
                      overlayClassName={styles.housingTooltip}
                    >
                      <span className={`icon-i-help ${styles.lint}`}/>
                    </Tooltip>
                  </span>}
                >
                    <Select
                      style={{width: '100%'}}
                      onChange={value => {setFieldValue('limitPoint', value)}}
                      value={values.limitPoint}
                      onBlur={() => {setFieldTouched('limitPoint', true)}}
                      >
                      {
                        data.map(item => (<Option key={item.key} value={item.label}>{item.label}</Option>))
                      }
                    </Select>
                </FormBox>
                <FormBox
                  errorMsg={errors.effectDate && touched.effectDate && errors.effectDate}
                  label='基数调整日期'
                  isRequired
                  className={styles.bottom}
                >
                    <DatePicker
                      format="M月D日"
                      style={{width: '100%'}}
                      onChange={value => {setFieldValue('effectDate', value)}}
                      onBlur={() => {setFieldTouched('effectDate', true)}}
                      value={!values.effectDate ? null : moment(values.effectDate, 'YYYY-MM-DD')}
                    />
                </FormBox>
              </SplitRow>
            </Layout>
            <Layout>
              <SplitRow>
                <FormBox
                  errorMsg={errors.pointScale && touched.pointScale && errors.pointScale}
                  label='小数点保留位数'
                  isRequired
                  className={styles.bottom}
                >
                  <Select
                    onChange={value => {setFieldValue('pointScale', value)}}
                    value={values.pointScale}
                    onBlur={() => {setFieldTouched('pointScale', true)}}
                  >
                    {
                      SALARY_SCALE_RULES.map(item => (<Option key={item.key} value={item.key}>{item.label}</Option>))
                    }
                  </Select>
                </FormBox>
                <FormBox
                  errorMsg={errors.pointRule && touched.pointRule && errors.pointRule}
                  label='小数点进位规则'
                  isRequired
                  className={styles.bottom}
                >
                  <Select
                    onChange={value => {setFieldValue('pointRule', value)}}
                    value={values.pointRule}
                    onBlur={() => {setFieldTouched('pointRule', true)}}
                  >
                    {
                      SALARY_POINT_RULES.map((item) => (<Option key={item.key} value={item.key}>{item.label}</Option>))
                    }
                  </Select>
                </FormBox>
              </SplitRow>
            </Layout>
            <Layout>
              <SplitRow>
                <FormBox
                  errorMsg={errors.limitUp && touched.limitUp && errors.limitUp}
                  label='缴纳基数上限'
                  isRequired
                  className={styles.bottom}
                >
                    <Input
                      onBlur={() => {setFieldTouched('limitUp', true)}}
                      onChange={e => {setFieldValue('limitUp', e.target.value)}}
                      value={values.limitUp}
                    />
                </FormBox>
                <FormBox
                  errorMsg={errors.limitDown && touched.limitDown && errors.limitDown}
                  label='缴纳基数下限'
                  isRequired
                  className={styles.bottom}
                >
                    <Input
                      onBlur={() => {setFieldTouched('limitDown', true)}}
                      onChange={e => {setFieldValue('limitDown', e.target.value)}}
                      value={values.limitDown}
                    />
                </FormBox>
              </SplitRow>
            </Layout>
            <div className={styles.title}>
              缴纳比例
            </div>
            <Layout>
              <SplitRow>
                <FormBox
                  errorMsg={errors.fundEmployerRatio && touched.fundEmployerRatio && errors.fundEmployerRatio}
                  label='单位缴纳'
                  isRequired
                  className={styles.bottom}
                >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('fundEmployerRatio', true)}}
                      onChange={e => {setFieldValue('fundEmployerRatio', e.target.value)}}
                      value={values.fundEmployerRatio}
                    />
                </FormBox>
                <FormBox
                  errorMsg={errors.fundPersonalRatio && touched.fundPersonalRatio && errors.fundPersonalRatio}
                  label='个人缴纳'
                  isRequired
                  className={styles.bottom}
                >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('fundPersonalRatio', true)}}
                      onChange={e => {setFieldValue('fundPersonalRatio', e.target.value)}}
                      value={values.fundPersonalRatio}
                    />
                </FormBox>
              </SplitRow>
            </Layout>
            <div className={styles.title}>
              补充缴纳比例
            </div>
            <Layout>
              <SplitRow>
                <FormBox
                  errorMsg={errors.fundAddingEmployerRatio && touched.fundAddingEmployerRatio && errors.fundAddingEmployerRatio}
                  label='单位缴纳'
                  isRequired
                  className={styles.bottom}
                >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('fundAddingEmployerRatio', true)}}
                      onChange={e => {setFieldValue('fundAddingEmployerRatio', e.target.value)}}
                      value={values.fundAddingEmployerRatio}
                    />
                </FormBox>
                <FormBox
                  errorMsg={errors.fundAddingPersonalRatio && touched.fundAddingPersonalRatio && errors.fundAddingPersonalRatio}
                  label='个人缴纳'
                  isRequired
                  className={styles.bottom}
                >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('fundAddingPersonalRatio', true)}}
                      onChange={e => {setFieldValue('fundAddingPersonalRatio', e.target.value)}}
                      value={values.fundAddingPersonalRatio}
                    />
                </FormBox>
              </SplitRow>
            </Layout>
          </Modal>)
        }}
      </Formik>
    )
  }
}

export default HousingFundModal

