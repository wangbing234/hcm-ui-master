import React, { Component } from 'react';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { Input, Checkbox } from 'components/Base';
import { FullRow } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import SubmitBtn from './SubmitBtn';
import styles from './Login.less';

const getFieldFromMeta = (meta) => {
  let field = '';
  switch(meta.code) {
    case '11003':
    field = 'username';
    break;
    case '11004':
    field = 'password';
    break;
    default:
    break;
  }
  return field;
}

@withFormik({
  validationSchema: Yup.object().shape({
    username: Yup.string().required('请输入用户名'),
    password: Yup.string().required('请输入密码'),
  }),
  mapPropsToValues: () => ({
    username: '',
    password: '',
  }),
  handleSubmit: (values, { props, setSubmitting, setFieldError }) => {
    const { onSubmit } = props;
    onSubmit(values)
    .catch(err => {
      if (err.meta) {
        const field = getFieldFromMeta(err.meta);
        setFieldError(field, err.meta.message);
      }
    })
    .finally(() => {
      setSubmitting(false);
    })
  },
  isInitialValid: true,
  enableReinitialize: true,
  displayName: 'loginByPasswordForm',
})
class LoginByPassword extends Component {

  onKeyPress = (event) => {
    const { handleSubmit } = this.props;
    if (event.charCode === 13) {
      handleSubmit();
    }
  }

  // 显示错误信息
  showErrorMsg = (field) => {
    const { errors, touched } = this.props;
    return errors[field] && touched[field] && errors[field];
  }

  render() {
    const {
      values,
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
    } = this.props;
    return (
      <div>
        <FormBox
          className={styles.formbox}
          label="账号"
          isRequired
          errorMsg={this.showErrorMsg('username')}
        >
          <Input
            shadow
            size="large"
            placeholder="请输入"
            name="username"
            error={!!this.showErrorMsg('username')}
            value={values.username}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyPress={this.onKeyPress}
          />
        </FormBox>
        <FormBox
          className={styles.formbox}
          label="密码"
          isRequired
          errorMsg={this.showErrorMsg('password')}
        >
          <Input
            shadow
            size="large"
            placeholder="请输入"
            name="password"
            type="password"
            error={!!this.showErrorMsg('password')}
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyPress={this.onKeyPress}
          />
        </FormBox>
        <FullRow className={styles.checkbox}>
          <a className={styles.forgotPassword} href="">忘记密码？</a>
          <Checkbox>自动登录</Checkbox>
        </FullRow>
        <FullRow>
          <SubmitBtn
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </FullRow>
      </div>
    );
  }
}

export default LoginByPassword;
