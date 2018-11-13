const func = require('lodash/function');

function map200Data(data = {}) {
  return {
    code: '0',
    message: 'SUCCESS',
    data,
  };
}

function rangeNumber(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
  map200Data,
  rangeNumber,
  injectApp: func.curry((mocks, app) => {
    mocks.forEach( mock => mock(app));
  }),
};
