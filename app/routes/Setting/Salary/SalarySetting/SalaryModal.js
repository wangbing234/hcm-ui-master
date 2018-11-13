import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { message } from 'antd';
import { Button, Switch, Input, Select , Modal} from 'components/Base';
import { Row, Column, FullRow } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import { SALARY_TYPES, SALARY_SCALE_RULES, SALARY_POINT_RULES } from 'constants/salary';
import { getFieldFromMeta } from './helper';
import List from './List';
import Editor from './Editor';
import styles from './SalarySetting.less';

class SalaryModal extends Component {

  editorRef = null;

  render() {
    const { visible, onCancel, onOk, data, salaryOption } = this.props;
    const isEdit = visible && !!data.id;
    const title = isEdit ? '编辑薪资项' : '新建薪资项';
    const isInternal = !!data.internal; // 是否内置薪资项



    return(
      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required('该字段必填'),
            type: Yup.string().required('该字段必填'),
            pointScale: Yup.string().required('该字段必填'),
            pointRule: Yup.string().required('该字段必填'),
            formula: isInternal
                    ? Yup.string().strip()
                    : Yup.string().required('该字段必填')
                      .test('formula', '公式不能为空', value => value !== '<br>'),
          })
        }
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const { internal, ...rest } = values;
          onOk(rest)
          .catch(err => {
            if (err.meta) {
              const errorMsg = err.meta.message;
              const field = getFieldFromMeta(err.meta);
              if (field) {
                setFieldError(field, errorMsg);
              } else {
                message.error(errorMsg);
              }

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
          function showErrorMsg(field) {
            return errors[field] && touched[field] && errors[field];
          }
          return(
            <Modal
              onCancel={onCancel}
              visible={visible}
              title={title}
              footer={(
                <div>
                  <Button onClick={onCancel}>取消</Button>
                  <Button type="primary" onClick={handleSubmit} loading={isSubmitting}>确认</Button>
                </div>
              )}
            >
              <FullRow className={styles.display}>
                <span className={styles.displayTitle}>显示在个人明细</span>
                <Switch
                  color="success"
                  checked={values.display}
                  onChange={value => {setFieldValue('display', value)}}
                />
              </FullRow>
              <Row>
                <Column>
                  <FormBox label="薪资项名称" isRequired errorMsg={showErrorMsg('name')}>
                    <Input
                      disabled={isInternal}
                      placeholder="请填写"
                      value={values.name}
                      onBlur={() => {setFieldTouched('name', true)}}
                      onChange={e => {setFieldValue('name', e.target.value)}}
                    />
                  </FormBox>
                </Column>
                <Column>
                  <FormBox label="类型" isRequired errorMsg={showErrorMsg('type')}>
                    <Select
                      disabled={isInternal}
                      placeholder="请选择"
                      value={values.type}
                      onBlur={() => {setFieldTouched('type', true)}}
                      onChange={value => {
                        setFieldValue('type', value);
                        this.editorRef.onChange('');
                      }}
                    >
                      {
                        SALARY_TYPES.map(item => (
                          <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
                        ))
                      }
                    </Select>
                  </FormBox>
                </Column>
              </Row>
              <Row>
                <Column>
                  <FormBox label="小数点保留位数" isRequired errorMsg={showErrorMsg('pointScale')}>
                    <Select
                      placeholder="请选择"
                      value={values.pointScale}
                      onBlur={() => {setFieldTouched('pointScale', true)}}
                      onChange={value => {setFieldValue('pointScale', value)}}
                    >
                      {
                        SALARY_SCALE_RULES.map(item => (
                          <Select.Option key={item.key} value={item.label}>{item.label}</Select.Option>
                        ))
                      }
                    </Select>
                  </FormBox>
                </Column>
                <Column>
                  <FormBox label="小数点进位规则" isRequired errorMsg={errors.pointRule && touched.pointRule && errors.pointRule}>
                    <Select
                      placeholder="请选择"
                      value={values.pointRule}
                      onBlur={() => {setFieldTouched('pointRule', true)}}
                      onChange={value => {setFieldValue('pointRule', value)}}
                    >
                      {
                        SALARY_POINT_RULES.map(item => (
                          <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>
                        ))
                      }
                    </Select>
                  </FormBox>
                </Column>
              </Row>
              <FullRow className={styles.formSubtitle}>薪资数额</FullRow>
              <Row>
                <Column>
                  <List
                    disabled={isInternal}
                    onInsert={(variable) => {this.editorRef.handleInsert(variable)}}
                    dataSource={salaryOption}
                  />
                </Column>
                <Column>
                  <FormBox errorMsg={showErrorMsg('formula')}>
                    <Editor
                      disabled={isInternal}
                      ref={e => { this.editorRef = e }}
                      salaryOption={salaryOption}
                      value={values.formula || ''}
                      onBlur={() => {setFieldTouched('formula', true)}}
                      onChange={value => {setFieldValue('formula', `${value}`)}}
                    />
                  </FormBox>
                </Column>
              </Row>
            </Modal>
          )
        }}
      </Formik>
    )
  }
}

export default SalaryModal;
