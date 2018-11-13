import React, { Component } from 'react';
import { connect } from 'dva';
import { Switch, Redirect, Route } from 'dva/router';
import Loadable from 'react-loadable';
import { Layout } from 'antd';
import SettingMenu from 'components/SettingMenu';
import { Loading } from 'components/Base';
import { AuthorizeRoute } from '../../routes';

const { Sider, Content } = Layout;

// 路由 loading
const routeLoading = (props) => {
  const { error, pastDelay } = props;
    if (error) {
      return <div>Error!</div>;
    } else if (pastDelay) {
      return <Loading visible center />;
    } else {
      return null;
    }
}

// 加载路由组件
const loadRouteComponent = (component) => {
  return Loadable({
    loader: () => component,
    loading: routeLoading,
  });
}

class Setting extends Component {
  render() {
    const { menus, location } = this.props;
    return (
      <Layout style={{ height: '100%' }}>
        {menus && menus.children ? (
          <Sider style={{ background: '#f3f3f3', borderRight: '1px solid #eaeaea' }} width={200}>
            <SettingMenu menus={menus.children} pathname={location.pathname} />
          </Sider>
        ) :
        null}
        <Content>
          <Switch>
            <Route
              exact
              path="/setting/organization/customField"
              component={loadRouteComponent(import('./Organization/CusOrgField.js'))}
            />
            <Route
              exact
              path="/setting/personnel/customField"
              component={loadRouteComponent(import('./Personnel/CusPersonnelField.js'))}
            />
            <Route
              exact
              path="/setting/personnel/customField/:id(\d+)"
              component={loadRouteComponent(import('./PersonnelDetail'))}
            />
            <Route
              exact
              path="/setting/personnel/customField/:type(position|basic|other)"
              component={loadRouteComponent(import('./PersonnelDetail'))}
            />
            <Route
              exact
              path="/setting/salary/salarySetting"
              component={loadRouteComponent(import('./Salary/SalarySetting'))}
            />
            <Route
              exact
              path="/setting/salary/payrollSetting"
              component={loadRouteComponent(import('./Salary/PayrollSetting'))}
            />
            <Route
              exact
              path="/setting/salary/insuranceSetting"
              component={loadRouteComponent(import('./Salary/InsuranceSetting'))}
            />
             <Route
              exact
              path="/setting/salary/TaxSetting"
              component={loadRouteComponent(import('./Salary/TaxSetting'))}
            />
            <AuthorizeRoute
              path="/setting"
              component={() => <Redirect to="/setting/organization/customField" />}
            />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default connect(({ global = {} }) => ({
  user: global.user,
  menus: global.menus.filter(item => item.key === 'setting')[0],
}))(Setting);
