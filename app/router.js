import React from 'react';
import { Redirect, routerRedux, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import DatePicker from 'antd/lib/date-picker/locale/zh_CN';
import Cookies from 'js-cookie';
import { AuthorizeRoute } from './routes';


moment.locale('zh', {
  weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
  monthsShort : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
});

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={{
      ...zhCN,
      DatePicker: {
        ...DatePicker,
        lang: {
          ...DatePicker.lang,
          monthFormat: 'M月',
        },
      },
      }}>
      <ConnectedRouter history={history}>
        <Switch>
          <AuthorizeRoute
            noCert
            path="/components"
            loader={() => import('./routes/TestComponents')}
          />
          <AuthorizeRoute path="/entry" noCert loaderRoute="Employee/Detail" />
          <AuthorizeRoute noCert path="/sign_in" loader={() => import('./layouts/UserLayout')} />
          <AuthorizeRoute
            path="/"
            loader={() => import('./layouts/BasicLayout')}
            cert={() => !!Cookies.get('authorization')}
            UnauthorizeComponent={() => <Redirect to="/sign_in" />}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
