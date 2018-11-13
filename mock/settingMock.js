const { map200Data } = require('./utils');

const orgCusFieldList = [
  {
    id: 10001,
    idx: 1, // 序号
    code: 'countries', // 字段编码
    label: '国家区域', // 字段名称
    required: true, // 是否必填
    targetType: 'company', // 所属
    fieldType: 'select', // 字段类型
    options: ['中国', '美国', '英国'],
    active: true, // 是否启用
  },
  {
    id: 10002,
    idx: 2, // 序号
    code: 'area', // 字段编码
    label: '地区', // 字段名称
    required: false, // 是否必填
    targetType: 'position', // 所属
    fieldType: 'text_field', // 字段类型
    placeholder: 'placeholder', // 字段提示文案
    length: 10, // 字段长度
    active: false,
  },
];

const orgCusField = {
  id: 10001,
  idx: 1, // 序号
  code: 'countries', // 字段编码
  label: '国家区域', // 字段名称
  required: true, // 是否必填
  targetType: 'company', // 所属
  fieldType: 'select', // 字段类型
  options: ['中国', '美国', '英国'],
  active: true, // 是否启用
};

module.exports = (app) => {
	app.get('/api/organizations/customized_fields', (req, res) => {
		res.send(map200Data(orgCusFieldList));
	});
	// 新增自定义字段
	app.post('/api/organizations/customized_fields', (req, res) => {
		res.send(map200Data(orgCusField));
	});
	// 编辑自定义字段
	app.put('/api/organizations/customized_fields/:id', (req, res) => {
		res.send(map200Data(orgCusField));
	});
	// 启用禁用自定义字段
	app.put('/api/organizations/customized_fields/:id/toggle_active', (req, res) => {
		res.send(map200Data(orgCusField));
	});
}
