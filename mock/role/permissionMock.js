const { map200Data } = require('../utils');

const roles = [
  {
    id: 10001,
    name: 'ABC管理',
  },
	{
    id: 10002,
    name: 'STO管理',
  },
];

const permission = {
  backend: [
    {
      code: "organizationManage",
      name: "组织管理",
      type: "catalogue",
      permissions: [
        {
          action: "GET",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
        {
          action: "EDIT",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
      ],
    },
    {
      code: "organization",
      name: "组织架构",
      type: "menu",
      permissions: [
        {
          action: "GET",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
        {
          action: "EDIT",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
      ],
    },
    {
      code: "company",
      name: "公司信息",
      type: "menu",
      permissions: [
        {
          action: "GET",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
        {
          action: "EDIT",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
      ],
    },
    {
      code: "department",
      name: "部门信息",
      type: "menu",
      permissions: [
        {
          action: "GET",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
        {
          action: "EDIT",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
      ],
    },
    {
      code: "position",
      name: "岗位信息",
      type: "menu",
      permissions: [
        {
          action: "GET",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
        {
          action: "EDIT",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
      ],
    },
    {
      code: "grade",
      name: "职级信息",
      type: "menu",
      permissions: [
        {
          action: "GET",
        },
        {
          action: "EDIT",
        },
      ],
    },
    {
      code: "employeeManage",
      name: "人事管理",
      type: "catalogue",
      permissions: [
        {
          action: "GET",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
        {
          action: "EDIT",
          conditions: [{
            field: "organizationId",
            op: "include",
            value: 2,
          }],
        },
      ],
    },
  ],
  frontend: [],
};

module.exports = (app) => {
	// 获取角色列表
	app.get('/api/authorization/roles', (req, res) => {
		res.send(map200Data(roles));
	});
	// 新增角色
	app.post('/api/authorization/roles', (req, res) => {
		res.send(map200Data());
  });
  //
  
	// 修改角色
	app.put('/api/authorization/roles/:id', (req, res) => {
		res.send(map200Data());
	});
	// 删除角色
	app.delete('/api/authorization/roles/:id', (req, res) => {
		res.send(map200Data());
	});
  // 获取角色权限配置
	app.get('/api/authorization/roles/:id/permissions', (req, res) => {
		res.send(map200Data(permission));
	});
  // 保存角色权限配置
	app.post('/api/authorization/roles/:id/permissions', (req, res) => {
		res.send(map200Data());
  });
}
