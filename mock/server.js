const express = require('express');
const globalMock = require('./globalMock');
const settingMock = require('./settingMock');
const orgTreeMock = require('./orgTreeMock');
const companyMock = require('./organizationMock/companyMock');
const gradeMock = require('./grade/gradeMock');
const personnelSettingMock = require('./personnelSettingMock');
const getEmployees = require('./getEmployees');
const employeeMock = require('./employeeMock');
const customField = require('./setting/personnel/customField');
const rolePermission = require('./role/permissionMock');
const roleAssignment = require('./role/assignmentMock');
const salarySetting = require('./setting/salary/salarySetting'); // 薪资项设置
const payrollSetting = require('./setting/salary/payrollSetting');
const getRe = require('./report')
const taxSetting = require('./setting/salary/taxSetting')
const salary = require('./salary');

const utils = require('./utils');

const PORT = 8765;
const app = express();

const delayMiddleware = (req, res, next) => {setTimeout(next, 300)};
const allowCrossDomain = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", 'Origin, Accept, Authorization, X-Requested-With, Content-Type');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
};

app.use(allowCrossDomain);
app.use(delayMiddleware);

// globalMock(app);
// settingMock(app);
// orgTreeMock(app);
// companyMock(app);
// gradeMock(app);
// personnelSettingMock(app);
// getEmployees(app);
// employeeMock(app);
// customField(app);
// roleAssignment(app);
// rolePermission(app);
// salarySetting(app);
// payrollSetting(app);
// getRe(app);

utils.injectApp([
  globalMock,
  settingMock,
  orgTreeMock,
  companyMock,
  gradeMock,
  personnelSettingMock,
  getEmployees,
  employeeMock,
  customField,
  roleAssignment,
  rolePermission,
  salarySetting,
  payrollSetting,
  taxSetting,
  salary,
  getRe,
], app);

app.listen(PORT, () => {
  console.log('http server running on:%d', PORT); // eslint-disable-line no-console
});
