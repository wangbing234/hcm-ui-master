const { map200Data } = require('../utils');

module.exports = (app) => {
	// 获取核算状态 1-已核算|0-未核算
	app.get('/api/salaries/account_status', (req, res) => {
		res.send(map200Data(0));
  });
}
