const { map200Data } = require('./utils');

const content = [];
for (let i = 2; i < 30; ) {
  content.push({
    id: i,
    name: '王人',
    avatar:
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534487067387&di=5cdfdd9613166815eaf9df7fc297272d&imgtype=0&src=http%3A%2F%2F02.imgmini.eastday.com%2Fmobile%2F20180719%2F20180719162752_8cfa8f64c38b1599335771b176111b61_1.jpeg',
    companyName: '奇点',
    departmentName: 'Sass事业部',
    employeeNo: 7,
    positionName: '后端master',
    gradeName: '终极',
    resignationDate: '2017-08-08',
    resignationReason: 'salary',
  });
  i += 1;
}

const getStaffsList = {
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

module.exports = (app) => {
	app.get('/api/employees', (req, res) => {
		res.send(map200Data(getStaffsList)); // getStaffsList
	});
}
