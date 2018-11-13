import dva from 'dva';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import createError from 'utils/createError';
import 'moment/locale/zh-cn';
import './index.less';
import './polyfill';
import { injectModel } from './models';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());
app.use(createError());

// 3. Inject model
injectModel(app);

// 4. Router
app.router(require('./router').default);


// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
