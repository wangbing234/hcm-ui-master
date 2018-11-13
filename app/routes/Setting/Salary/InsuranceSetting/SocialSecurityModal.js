import React, {Component} from 'react'
import * as Yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment'
import Modal from 'components/Base/Modal';
import { createPromiseDispatch } from 'utils/actionUtil';
import { SALARY_SCALE_RULES, SALARY_POINT_RULES, SOCIAL_SECURITY_PLAN_CONFIG } from 'constants/salary'
import { actions } from 'models/settingInsuranceSetting'
import FormBox from 'components/FormBox'
import { Button, Input } from 'components/Base'
import { Layout, SplitRow } from 'layouts/FormLayout';
import { Tooltip, Select, DatePicker} from 'antd'
import styles from './InsuranceSetting.less'

const data = [];
for(let i = 1; i < 31; ){
  data.push({key: i, label: i})
  i += 1;
};

function getFieldFromMeta(meta) {
  let field = '';
  switch(meta.code) {
    case '16002':
    field = 'name';
    break;
    default:
    break;
  }
  return field;
}

const { Option } = Select

const {
  GET_SOCIAL_SECURITY_PLANS,
  SAVE_SOCIAL_SECURITY_PLANS,
  SOCIAL_SECURITY_FIELD_CHANGE,
} = actions


class EditModel extends Component{

  promiseDispatch = createPromiseDispatch();

  handleCancel = () => {
    const {closeModal, dispatch} = this.props
    SOCIAL_SECURITY_FIELD_CHANGE(dispatch, {payload: {...SOCIAL_SECURITY_PLAN_CONFIG}})
    closeModal('socialModalStatus')
  }

  render() {
    const { socialSecurityScheme, socialModalStatus } = this.props
    return(
      <Formik
        enableReinitialize
        initialValues={socialSecurityScheme}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required('该字段必填'),
            limitPoint: Yup.string().required('该字段必填'),
            effectDate: Yup.string().nullable(true).required('该字段必填'),
            pointRule: Yup.string().required('该字段必填'),
            pointScale: Yup.string().required('该字段必填'),
            limitUp: Yup.number().typeError('请输入数字').required('该字段必填'),
            limitDown: Yup.number().typeError('请输入数字').lessThan(Yup.ref('limitUp'), '下限值不能大于下限值').required('该字段必填'),
            outworkEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            outworkPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            pensionEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            pensionPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            injuryEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            injuryPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            historyEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            historyPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            birthEmployerRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
            birthPersonalRatio: Yup.number().typeError('请输入数字').min(0, '请输入大于零的数').max(100, '请输入小于100的数').required('该字段必填'),
          })
        }
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const {dispatch, closeModal} = this.props;
          return this.promiseDispatch(SAVE_SOCIAL_SECURITY_PLANS, values)
          .then(() => {
            GET_SOCIAL_SECURITY_PLANS(dispatch, { payload: {}})
            SOCIAL_SECURITY_FIELD_CHANGE(dispatch, {payload: {...SOCIAL_SECURITY_PLAN_CONFIG}})
            closeModal('socialModalStatus')
            setSubmitting(false);
          })
          .catch(err => {
            if (err.meta) {
              setSubmitting(false);
              const field = getFieldFromMeta(err.meta);
              setFieldError(field, err.meta.message);
            }
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
              visible={socialModalStatus}
              title={socialSecurityScheme.id === undefined ? '新增社保方案' : '编辑社保方案'}
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
                  label='社保方案名称'
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
                        title={`每月${values.limitPoint}日前入职缴纳社保，${values.limitPoint + 1}日及以后入职不缴纳社保 每月${values.limitPoint}日前离职不缴纳社保，${values.limitPoint + 1}日及以后离职缴纳社保`}
                        placement="right"
                        overlayClassName={styles.socialTooltip}
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
                养老保险
              </div>
              <Layout>
                <SplitRow>
                  <FormBox
                    errorMsg={errors.pensionEmployerRatio && touched.pensionEmployerRatio && errors.pensionEmployerRatio}
                    label='单位缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                      <Input
                        suffix="%"
                        onBlur={() => {setFieldTouched('pensionEmployerRatio', true)}}
                        onChange={e => {setFieldValue('pensionEmployerRatio', e.target.value)}}
                        value={values.pensionEmployerRatio}
                      />
                  </FormBox>
                  <FormBox
                    errorMsg={errors.pensionPersonalRatio && touched.pensionPersonalRatio && errors.pensionPersonalRatio}
                    label='个人缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                      <Input
                        suffix="%"
                        onBlur={() => {setFieldTouched('pensionPersonalRatio', true)}}
                        onChange={e => {setFieldValue('pensionPersonalRatio', e.target.value)}}
                        value={values.pensionPersonalRatio}
                      />
                  </FormBox>
                </SplitRow>
              </Layout>
              <div className={styles.title}>
                医疗保险
              </div>
              <Layout>
                <SplitRow>
                  <FormBox
                    errorMsg={errors.historyEmployerRatio && touched.historyEmployerRatio && errors.historyEmployerRatio}
                    label='单位缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('historyEmployerRatio', true)}}
                      onChange={e => {setFieldValue('historyEmployerRatio', e.target.value)}}
                      value={values.historyEmployerRatio}
                    />
                  </FormBox>
                  <FormBox
                    errorMsg={errors.historyPersonalRatio && touched.historyPersonalRatio && errors.historyPersonalRatio}
                    label='个人缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('historyPersonalRatio', true)}}
                      onChange={e => {setFieldValue('historyPersonalRatio', e.target.value)}}
                      value={values.historyPersonalRatio}
                    />
                  </FormBox>
                </SplitRow>
              </Layout>
              <div className={styles.title}>
                失业保险
              </div>
              <Layout>
                <SplitRow>
                  <FormBox
                    errorMsg={errors.outworkEmployerRatio && touched.outworkEmployerRatio && errors.outworkEmployerRatio}
                    label='单位缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('outworkEmployerRatio', true)}}
                      onChange={e => {setFieldValue('outworkEmployerRatio', e.target.value)}}
                      value={values.outworkEmployerRatio}
                    />
                  </FormBox>
                  <FormBox
                    errorMsg={errors.outworkPersonalRatio && touched.outworkPersonalRatio && errors.outworkPersonalRatio}
                    label='个人缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('outworkPersonalRatio', true)}}
                      onChange={e => {setFieldValue('outworkPersonalRatio', e.target.value)}}
                      value={values.outworkPersonalRatio}
                    />
                  </FormBox>
                </SplitRow>
              </Layout>
              <div className={styles.title}>
                工伤保险
              </div>
              <Layout>
                <SplitRow>
                  <FormBox
                    errorMsg={errors.injuryEmployerRatio && touched.injuryEmployerRatio && errors.injuryEmployerRatio}
                    label='单位缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('injuryEmployerRatio', true)}}
                      onChange={e => {setFieldValue('injuryEmployerRatio', e.target.value)}}
                      value={values.injuryEmployerRatio}
                    />
                  </FormBox>
                  <FormBox
                    errorMsg={errors.injuryPersonalRatio && touched.injuryPersonalRatio && errors.injuryPersonalRatio}
                    label='个人缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('injuryPersonalRatio', true)}}
                      onChange={e => {setFieldValue('injuryPersonalRatio', e.target.value)}}
                      value={values.injuryPersonalRatio}
                    />
                  </FormBox>
                </SplitRow>
              </Layout>
              <div className={styles.title}>
                生育保险
              </div>
              <Layout>
                <SplitRow>
                  <FormBox
                    errorMsg={errors.birthEmployerRatio && touched.birthEmployerRatio && errors.birthEmployerRatio}
                    label='单位缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('birthEmployerRatio', true)}}
                      onChange={e => {setFieldValue('birthEmployerRatio', e.target.value)}}
                      value={values.birthEmployerRatio}
                    />
                  </FormBox>
                  <FormBox
                    errorMsg={errors.birthPersonalRatio && touched.birthPersonalRatio && errors.birthPersonalRatio}
                    label='个人缴纳'
                    isRequired
                    className={styles.bottom}
                  >
                    <Input
                      suffix="%"
                      onBlur={() => {setFieldTouched('birthPersonalRatio', true)}}
                      onChange={e => {setFieldValue('birthPersonalRatio', e.target.value)}}
                      value={values.birthPersonalRatio}
                    />
                  </FormBox>
                </SplitRow>
              </Layout>
            </Modal>
          )
        }}
      </Formik>
    )
  }
}

export default EditModel

