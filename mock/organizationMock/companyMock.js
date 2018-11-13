const { map200Data } = require('../utils');

const content = [];
for (let i = 0; i < 40; ) {
  content.push({
    address: '',
    alias: `alias${i}`,
    code: `code${i}`,
    enable: false,
    enableTime: '',
    id: i + 1,
    name: `name${i}`,
    parentId: i && `${i}`,
    parentName: `parentName${i}`,
    registerAddress: '',
  });
  i += 1;
}

const getCompanies = {
  content,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  pageable: {
    offset: 0,
    pageNumber: 1,
    pageSize: 20,
    paged: true,
    sort: {
      sorted: true,
      unsorted: true,
    },
    unpaged: true,
  },
  size: 0,
  sort: {
    sorted: true,
    unsorted: true,
  },
  totalElements: content.length,
  totalPages: 2,
};

const getCompanyTree = {
  id: '0',
  name: '顶级公司',
  children: [
    {
      id: 1,
      name: '二级公司1',
      children: [
        {
          id: 4,
          name: '三级公司1.1',
        },
        {
          id: 5,
          name: '三级公司1.2',
          children: [
            {
              id: 6,
              name: '四级公司1.2.1',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '二级公司2',
      children: [
        {
          id: 7,
          name: '三级公司2.1',
        },
      ],
    },
    {
      id: 3,
      name: '二级公司3',
    },
  ],
};

const companyInfo = {
  id: 3,
  code: 'TestLaw1',
  name: 'TestLaw1',
  alias: 'TestLaw1',
  address: '',
  registerAddress: '',
  enable: 0,
  enableTime: '2018-08-15 08:00:00',
  parentId: 2,
  parentName: '公司名称',
  master: '',
  legalPerson: '',
  customField: {
    enable: 0,
  },
};

module.exports = (app) => {
	app.get('/api/company', (req, res) => {
		res.send(map200Data(getCompanies));
	});
	app.get('/api/company/companyTree', (req, res) => {
		res.send(map200Data(getCompanyTree));
	});
	app.put('/api/company', (req, res) => {
		res.send(map200Data()); // updateCompany
	});
	app.post('/api/company', (req, res) => {
		res.send(map200Data()); // createCompany
	});
	app.get('/api/company/:id', (req, res) => {
		res.send(map200Data(companyInfo)); // getCompany
	});
	app.delete('/api/company/:id', (req, res) => {
		res.send(map200Data()); // deleteCompany
	});
	app.post('/api/company/enable/:id', (req, res) => {
		res.send(map200Data()); // inactiveCompany
	});
	app.get('/api/company/list', (req, res) => {
		res.send(map200Data(getCompanies));
	});
}
