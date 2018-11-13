const utils = require('../utils');

const basic = require('./basic');
const employee = require('./employee');

module.exports = utils.injectApp([basic, employee]);
