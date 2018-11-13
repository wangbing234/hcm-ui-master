const { map200Data } = require('../../utils');

const getSalaryList = () => {
  const data = {
    "firstCycleMonth": "2018-09-10T09:03:01.551Z",
    "salaryPayDate": 3,
    "startCycleDay": 5,
  }
  return data;
}

const getSocialSecurityPlans = () => {
  const data = [{
    "birthEmployerRatio": 0,
    "birthPersonalRatio": 0,
    "effectDate": "2018-09-25T01:46:09.653Z",
    "historyEmployerRatio": 0,
    "historyPersonalRatio": 0,
    "id": 0,
    "injuryEmployerRatio": 0,
    "injuryPersonalRatio": 0,
    "limitDown": 0,
    "limitPoint": 0,
    "limitUp": 0,
    "name": "string",
    "outworkEmployerRatio": 0,
    "outworkPersonalRatio": 0,
    "pensionEmployerRatio": 0,
    "pensionPersonalRatio": 0,
    "pointRule": "round",
    "pointScale": 0,
  }]
  return data;
}

module.exports = (app) => {
	// 获取列表
	app.get('/api/salaries/setting/config', (req, res) => {
		res.send(map200Data(getSalaryList()));
  });

  // 【设置-薪资项设置】删除
	app.delete('/api/salaries/item/:id', (req, res) => {
		res.send(map200Data());
  });

  app.get('/api/salaries/social_security_plans', (req, res) => {
		res.send(map200Data(getSocialSecurityPlans()));
	});
};
