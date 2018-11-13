const { map200Data } = require('../utils');


const content = [];
for (let i = 0; i < 25; ) {
  content.push({
    id: i,
    companyName: `company${i}`,
    departmentName: `department${i}`,
    employeeName: '王二哈',
    mobile: '12345678998', 
    roles: [
      {
        id: 1,
  name: "ABC管理",   
      },
      {
        id: 2,
  name: "STO管理",   
      },
],
  });
  i += 1;
}
const getRolesEmployees = {
    content,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    pageable: {
      offset: 0,
      pageNumber: 0,
      pageSize: 0,
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
    totalElements: 0,
    totalPages: 0,
};
const getRolesEmployee = {
  id: 0,
  companyName: '王二公司',
  departmentName: '设计部',
  employeeName: '王二哈',
  mobile: '12345678998', 
  roles: [
    {
      id: 1,
name: "ABC管理",   
    },
    {
      id: 2,
name: "STO管理",   
    },
],

}

module.exports = (app) => {
	// 获取员工列表
	app.get('/api/authorization/employees', (req, res) => {
		res.send(map200Data(getRolesEmployees));
  });
  // 获取单条员工列表
	app.get('/api/authorization/roles/employee', (req, res) => {
		res.send(map200Data(getRolesEmployee));
	});
	// 编辑角色分配
	app.post('/api/authorization/employees/{id}/roles', (req, res) => {
		res.send(map200Data());
	});
}