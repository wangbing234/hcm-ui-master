const { map200Data, rangeNumber } = require('../../utils');

const getSalaryList = () => {
  const list = [];
  for (let i = 0; i < rangeNumber(5, 15); i+=1) {
    const idEven = i%2 === 0;
    list.push({
      id: i+1,
      name: `饭补${i}`,
      type: idEven ? 'taxBeforeAdd' : 'laborCost',
      formula: '${dutyDays0}+${dutyDays1}', // eslint-disable-line
      pointRule: 'round',
      pointScale: 1,
      display: idEven ? !!1 : !!0,
    });
  }
  return list;
}

const getSalaryOption = () => {
  const list = [];
  for (let i = 0; i < rangeNumber(5, 15); i+=1) {
    list.push({
      "id": i+1,
      "name": `出勤天数${i}`,
      "code": `dutyDays${i}`,
    });
  }
  return list;
}



module.exports = (app) => {
	// 【设置-薪资项设置】获取列表
	app.get('/api/salaries/items/', (req, res) => {
		res.send(map200Data(getSalaryList()));
  });

  // 【设置-薪资项设置】获取列表
	app.get('/api/salaries/items/option', (req, res) => {
		res.send(map200Data(getSalaryOption()));
  });

  // 【设置-薪资项设置】删除
	app.delete('/api/salaries/items/:id', (req, res) => {
		res.send(map200Data());
  });

  // 【设置-薪资项设置】编辑
	app.put('/api/salaries/items/:id', (req, res) => {
		res.send(map200Data());
  });

  // 【设置-薪资项设置】新建
	app.post('/api/salaries/items/', (req, res) => {
		res.send(map200Data());
	});
};
