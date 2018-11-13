// 参考自：https://www.cnblogs.com/juexin/p/9401078.html

const context = require.context('./', false, /\.js$/);
const models = context.keys().filter(filePath => filePath !== './index.js').map(key => context(key));

export function injectModel(app) {

  // app.model(require('./global').default);
  // app.model(require('./login').default);
  // app.model(require('./company').default);
  // app.model(require('./department').default);
  // app.model(require('./organization').default);
  // app.model(require('./grade').default);
  // app.model(require('./setting').default);
  // app.model(require('./position').default);
  // app.model(require('./personnel').default);
  // app.model(require('./settingPersonnelDetail').default);
  // app.model(require('./employee').default);
  // app.model(require('./getEmployees').default);
  // app.model(require('./rolePermission').default);
  // app.model(require('./settingSalarySetting').default);

  models.forEach(key => {
    app.model(key.default);
  });
}
