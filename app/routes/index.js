import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'dva';
import { Route } from 'dva/router';

import { Loading } from 'components/Base';

const routerDataCache = new Map();

function RouterComponent(props) {
  const { loaderRoute, ...rest } = props;
  let { component, loader } = props;
  if (loaderRoute && typeof loaderRoute === 'string') {
    loader = () => import(`../routes/${loaderRoute}`);
  }
  if (loader && typeof loader === 'function') {
    let cache = routerDataCache.get(loader);
    if (!cache) {
      cache = Loadable({
        loader,
        loading: () => <Loading visible center />,
      });
      routerDataCache.set(loader, cache);
    }
    component = cache;
  }
  return <Route {...rest} component={component} />;
}

function hasCurrentMenu(menus, path) {
  let res = false;
  const loop = (data, key) => {
    if (data && data.length > 0 && key) {
      data.map(item => {
        if (item.key === key) {
          res = true;
          return res;
        } else {
          return loop(item.children, key);
        }
      });
    }
  };
  if (menus && menus.length > 0 && path) {
    loop(menus, path);
  }
  return res;
}

export const AuthorizeRoute = connect(({ global = {} }) => ({
  menus: global.menus,
}))(props => {
  const { noCert, cert, UnauthorizeComponent, menus, path, ...rest } = props;
  // const checkCert = (data, key) => {
  //   if(data && data.length > 0 && key) {
  //     return data.map(menu => {
  //       if (menu.key === key) {
  //         return true;
  //       } else {
  //         return checkCert(menu.children, key);
  //       }
  //     });
  //   } else {
  //     return false;
  //   }
  // }
  let certed = noCert || hasCurrentMenu(menus, path.split('/').slice(-1).pop());
  if (cert && typeof cert === 'function') {
    certed = cert(certed);
  }

  if (certed) {
    return <RouterComponent path={path} {...rest} />;
  }
  return UnauthorizeComponent ? <UnauthorizeComponent /> : <div>Not Auth</div>;
});


