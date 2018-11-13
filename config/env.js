const deployConfig = require('./deployConfig');

module.exports = ((config) => {
  return config[process.env.DEPLOY_ENV];
})(deployConfig);
