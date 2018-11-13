// 获取自定义表单数据
const { map200Data } = require('../../../utils');

const customizedForms = {
  title: '模块名称',
  multiRecord: true,
  required: true,
  onBoard: true,
  fields: [
    {
      id: 1,
      fieldType: 'decimal',
      attribute: {
        label: '未定义标题',
        required: false,
        min: 10,
        max: 100,
        decimal: 0,
        defaultValue: 0,
      },
    },
    {
      id: 2,
      fieldType: 'radio',
      attribute: {
        label: '未定义标题',
        required: false,
        options: ['选项1', '选项2'],
      },
    },
    {
      id: 3,
      fieldType: 'date',
      attribute: {
        label: '未定义标题',
        required: false,
        format: 'date',
      },
    },
    {
      id: 4,
      fieldType: 'dateRange',
      attribute: {
        label: '未定义标题',
        required: false,
        format: 'date',
      },
    },
  ],
};

module.exports = (app) => {
	// 【设置-人事管理-自定义模块】获取表单数据
	app.get('/api/employees/customized_forms/:id/', (req, res) => {
		res.send(map200Data(customizedForms)); // getCustomizedForms
	});
	// 【设置-人事管理-自定义模块】新建表单
	app.post('/api/employees/customized_forms/', (req, res) => {
		res.send(map200Data()); // submitCustomizedForms
	});
	// 【设置-人事管理-自定义模块】修改表单
	app.put('/api/employees/customized_forms/:id/', (req, res) => {
		res.send(map200Data()); // submitCustomizedForms
	});
};
