const _ = require('lodash');

function filterArg(argName, arg) {
  return arg.indexOf(argName) > -1 ? arg : null;
}

const filterDeploy = _.curry(filterArg)('--env');

function argValue(arg) {
  return _.split(arg, '=')[1];
}

const deployConfig = process.argv.reduce((env, arg) => {
  return filterDeploy(arg);
}, null);

const DEPLOY_ENV = argValue(deployConfig) || 'dev';

module.exports = {
  DEPLOY_ENV,
}
