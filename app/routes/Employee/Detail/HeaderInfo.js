import React, { PureComponent } from 'react';
import moment from 'moment';
import { Layout, SplitRow, FullRow } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import { Input, Select, DatePicker } from 'components/Base';

import Avatar from './Avatar';

function nothing(...val) {
  return val;
}

function getInputVal(e) {
  return e.target.value;
}

function getDateVal(date, dateString) {
  return dateString;
}

export default class HeaderInfo extends PureComponent {

  getProps = (code, getVal) => {
    const { data, onChange } = this.props;
    return {
      value: data.get(code) || undefined,
      onChange: (...args) => {
        onChange(code, ...[].concat(getVal(...args)));
      },
    };
  };

  render() {
    const { error } = this.props;
    const birthday = this.getProps('birthday', getDateVal);
    birthday.value = birthday.value ? moment(birthday.value) : undefined;
    // const effectsError = this.getEffectError();
    return (
      <Layout>
        <SplitRow>
          <Layout>
            <FullRow>
              <FormBox label="姓名" isRequired errorMsg={(error||{}).name}>
                <Input transparent placeholder="请输入" {...this.getProps('name', getInputVal)} />
              </FormBox>
            </FullRow>
            <FullRow>
              <FormBox label="工号" isRequired errorMsg={(error||{}).employeeNo}>
                <Input transparent placeholder="请输入" {...this.getProps('employeeNo', getInputVal)} />
              </FormBox>
            </FullRow>
            <FullRow>
              <FormBox label="手机号（将作为员工登录账号）" isRequired errorMsg={(error||{}).mobile}>
                <Input transparent placeholder="请输入" {...this.getProps('mobile', getInputVal)} />
              </FormBox>
            </FullRow>
          </Layout>
          <Layout>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: 0, top: 0, borderRadius: 6, border: (error||{}).avatar ? '1px solid #f15b50':'none' }}>
                <Avatar {...this.getProps('avatar', nothing)} />
              </div>
            </div>
          </Layout>
        </SplitRow>
        <SplitRow>
          <FormBox label="性别" isRequired errorMsg={(error||{}).gender}>
            <Select
              transparent
              style={{ width: '100%' }}
              placeholder="请选择"
              {...this.getProps('gender', nothing)}
            >
              <Select.Option value="female">女</Select.Option>
              <Select.Option value="male">男</Select.Option>
            </Select>
          </FormBox>
          <FormBox label="生日" isRequired errorMsg={(error||{}).birthday}>
            <DatePicker transparent placeholder="请选择" style={{ width: '100%' }} {...birthday} />
          </FormBox>
        </SplitRow>
      </Layout>
    );
  }
}
