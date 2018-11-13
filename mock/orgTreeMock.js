const { map200Data } = require('./utils');

const getOrgTree = {
  id: 1,
  name: '奇点集团',
  code: 'qdjt',
  type: 'company',
  parentId: -1,
  master: '',
  children: [
    {
      id: 2,
      name: '有招责任有限公司',
      code: 'yzzryxgs',
      type: 'company',
      parentId: 1,
      master: '',
      children: [
        {
          id: 5,
          name: '产品研发部',
          code: 'cpyfb',
          type: 'department',
          parentId: 2,
          master: '',
          children: [],
        },
        {
          id: 6,
          name: '产品设计部',
          code: 'cpsjb',
          type: 'department',
          parentId: 2,
          master: '',
          children: [],
        },
      ],
    },
    {
      id: 3,
      name: '盈盈有限公司',
      code: 'yyyxgs',
      type: 'company',
      parentId: 1,
      master: '',
      children: [
        {
          id: 7,
          name: '市场部',
          code: 'scb',
          type: 'department',
          parentId: 3,
          master: '',
          children: [],
        },
      ],
    },
    {
      id: 4,
      name: '行政部',
      code: 'xzb',
      type: 'department',
      parentId: 1,
      master: '',
      children: [],
    },
  ],
};

module.exports = (app) => {
	app.get('/api/company/tree', (req, res) => {
		res.send(map200Data(getOrgTree));
	});
};
