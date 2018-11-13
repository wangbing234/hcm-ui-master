const { map200Data} = require('../../utils');

const TaxList =[
    {
        "id": 1,
        "name": "中国公民个人所得税",
        "point": 5000,
        "type": "chinese",
        },
        {
        "id": 2,
        "name": "外籍人个人所得税",
        "point": 4800,
        "type": "foreign",
        }]

// const TaxList = {
//     content,
// }
module.exports = (app) => {
	// 【设置-薪资项设置】获取列表
	app.get('/api/salaries/setting/threshold', (req, res) => {
		res.send(map200Data(TaxList));
  });

  // 【设置-薪资项设置】获取列表
	app.get('/api/salaries/editTax', (req, res) => {
		res.send(map200Data());
  });
};
