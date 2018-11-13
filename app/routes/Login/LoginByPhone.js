import React, { Component } from 'react';
import validator from 'validator';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { Row, Col } from 'antd';
import { Button, Input, Checkbox } from 'components/Base';
import { FullRow } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import SubmitBtn from './SubmitBtn';
import styles from './Login.less';

// 验证手机号
const testPhone = (value) => {
  const mobile = value === undefined ? '' : value;
  return validator.isMobilePhone(mobile, 'zh-CN')
}

const getFieldFromMeta = (meta) => {
  let field = '';
  switch(meta.code) {
    case '11003':
    field = 'phone';
    break;
    case '11005':
    field = 'code';
    break;
    default:
    break;
  }
  return field;
}


@withFormik({
  validationSchema: Yup.object().shape({
    phone: Yup.string().required('请输入手机号').test('phone', '请输入正确的手机号', testPhone),
    code: Yup.string().required('请输入短信验证码'),
  }),
  mapPropsToValues: () => ({
    phone: '',
    code: '',
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
  displayName: 'loginByPhoneForm',
})
class LoginByPhone extends Component {
  state = {
    sendBtnDisabled: false, // 发送短信按钮是否禁用
    count: 0,
  };

  onKeyPress = (event) => {
    const { handleSubmit } = this.props;
    if (event.charCode === 13) {
      handleSubmit();
    }
  }

  // 发送短信按钮点击
  handleSendBtn = () => {
    const {
      onGetCode,
      values,
      setFieldError,
      setFieldTouched,
    } = this.props;

    const { phone } = values;

    setFieldTouched('phone', true, true);

    if (phone && testPhone(phone)) {
      onGetCode(phone)
      .then(() => {
        this.handleCount();
        this.setState({ sendBtnDisabled: true });
      })
      .catch(err => {
        if (err.meta) {
          setFieldError('phone', err.meta.message);
        }
      })
    }
  };

  // 验证码倒计时
  handleCount = (s = 59) => {
    let count = s;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        this.setState({ sendBtnDisabled: false });
        clearInterval(this.interval);
      }
    }, 1000);
  };

  // 显示错误信息
  showErrorMsg = (field) => {
    const { errors, touched } = this.props;
    return errors[field] && touched[field] && errors[field];
  }

  render() {
    const { count, sendBtnDisabled } = this.state;
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
          label="请输入手机号"
          isRequired
          errorMsg={this.showErrorMsg('phone')}
        >
          <Input
            shadow
            size="large"
            placeholder="请输入"
            name="phone"
            error={!!this.showErrorMsg('phone')}
            value={values.phone}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyPress={this.onKeyPress}
          />
        </FormBox>
        <FormBox
          className={styles.formbox}
          label="获取短信验证码"
          isRequired
          errorMsg={this.showErrorMsg('code')}
        >
          <Row gutter={10}>
            <Col span={12}>
              <Input
                shadow
                size="large"
                placeholder="请输入"
                name="code"
                error={!!this.showErrorMsg('code')}
                value={values.code}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyPress={this.onKeyPress}
              />
            </Col>
            <Col span={12}>
              <Button
                display="block"
                disabled={sendBtnDisabled}
                className={styles.verificationBtn}
                onClick={this.handleSendBtn}
                size="large"
              >
                {count ? `${count}秒后重试` : '发送短信验证码'}
              </Button>
            </Col>
          </Row>
        </FormBox>
        <FullRow className={styles.checkbox}>
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

export default LoginByPhone;
