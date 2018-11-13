import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Switch } from 'dva/router';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import SiderMenu from 'components/SiderMenu';
import Spinner from 'components/Spinner';
import GlobalHeader from 'components/GlobalHeader';
import LayoutContent from 'components/LayoutContent';
import FetchGlobalData from 'components/FetchGlobalData';
import { tree2flat } from 'utils/utils';
import { AuthorizeRoute } from '../routes';

const defaultTitle = document.title; // 获取默认的title

class BasicLayout extends Component {
  render() {
    const { loading, menus, ...rest } = this.props;
    const { location, dispatch } = rest;
    const localPath = location.pathname.split('/')[1];
    const currentMenu = tree2flat(menus)
      .filter(menu => menu.path)
      .find(menu => {
        return menu.key === localPath;
      });
    const pageTitle = currentMenu ? `${currentMenu.name} - ${defaultTitle}` : defaultTitle;

    return (
      <DocumentTitle title={pageTitle}>
        <FetchGlobalData dispatch={dispatch}>
          <Layout style={{ height: '100%' }}>
            <GlobalHeader />
            <Layout>
              <SiderMenu menus={menus} {...rest} />
              <LayoutContent style={{ background: '#f9f9f9', position: 'relative' }}>
                {loading ? (
                  <Spinner />
                ) : (
                  <Switch>
                    <AuthorizeRoute path="/organizations" exact loaderRoute="Organization" />
                    <AuthorizeRoute path="/companies" exact loaderRoute="Company" />
                    <AuthorizeRoute path="/departments" exact loaderRoute="Department" />
                    <AuthorizeRoute path="/grade" loaderRoute="Grade" />
                    <AuthorizeRoute path="/setting" loaderRoute="Setting" />
                    <AuthorizeRoute path="/on_board_staffs" loaderRoute="Employee/OnBoardStaffs" />
                    <AuthorizeRoute path="/resigned_employees" loaderRoute="Employee/ResignedEmployees" />
                    <AuthorizeRoute path="/job_positions" loaderRoute="Position" />
                    <AuthorizeRoute path="/salary_list" loaderRoute="Salary/List" />
                    <AuthorizeRoute path="/unpaid_salary_list" loaderRoute="Salary/List/UnpaidList" />
                    <AuthorizeRoute path="/salary_report" loaderRoute="Salary/Report" />
                    <AuthorizeRoute path="/role_permission" loaderRoute="Role/Permission" />
                    <AuthorizeRoute path="/role_assignment" loaderRoute="Role/Assignment" />
                    <Route exact component={() => <div>Not Found</div>} />
                  </Switch>
                )}
              </LayoutContent>
            </Layout>
          </Layout>
        </FetchGlobalData>
      </DocumentTitle>
    );
  }
}

export default connect(({ loading, global = {} }) => ({
  ...global,
  menus: global.menus,
  loading: loading.models.global,
}))(BasicLayout);
