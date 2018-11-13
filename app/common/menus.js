export default {
  menuData: [
    {
      name: '组织管理',
      icon: 'icon-o-branch',
      key: 'orgs',
      code: 'organizationManage',
      children: [
        {
          name: '组织架构',
          path: '/organizations',
          key: 'organizations',
          code: 'organization',
        },
        {
          name: '公司信息',
          path: '/companies',
          key: 'companies',
          code: 'company',
        },
        {
          name: '部门信息',
          path: '/departments',
          key: 'departments',
          code: 'department',
        },
        {
          name: '岗位信息',
          path: '/job_positions',
          key: 'job_positions',
          code: 'position',
        },
        {
          name: '职级信息',
          path: '/grade',
          key: 'grade',
          code: 'grade',
        },
      ],
    },
    /*
    {
      name: '自定表单',
      icon: 'icon-seal',
      key: 'customized_forms',
      code: '',
      children: [
        {
          name: '自定义表单',
          path: '/customized_forms',
          key: 'customized_forms',
          code: '',
        },
      ],
    },
    */
    {
      name: '人事管理',
      icon: 'icon-human-o',
      key: 'personnel',
      code: 'employeeManage',
      children: [
        {
          name: '在职员工',
          path: '/on_board_staffs',
          key: 'on_board_staffs',
          code: '',
        },
        {
          name: '离职员工',
          path: '/resigned_employees',
          key: 'resigned_employees',
          code: '',
        },
      ],
		},
		{
      name: '薪资管理',
      icon: 'icon-money-o',
      key: 'salary',
      code: '',
      children: [
        {
          name: '本月明细',
          path: '/salary_list',
          key: 'salary_list',
          code: '',
        },
        {
          hide: true,
          name: '未计薪员工列表',
          path: '/unpaid_salary_list',
          key: 'unpaid_salary_list',
          code: '',
        },
        {
          name: '报表',
          path: '/salary_report',
          key: 'salary_report',
          code: '',
        },
      ],
    },
		{
      name: '角色管理',
      icon: 'icon-lock1',
      key: 'role',
      code: '',
      children: [
        {
          name: '角色权限',
          path: '/role_permission',
          key: 'role_permission',
          code: '',
        },
        {
          name: '角色分配',
          path: '/role_assignment',
          key: 'role_assignment',
          code: '',
        },
      ],
    },
    {
      name: '设置',
      icon: 'icon-o-preferences',
      key: 'setting',
      code: '',
      path: '/setting',
      children: [
        {
          name: '组织管理',
          path: '/organization',
          key: 'organization',
          children: [
            {
              name: '自定义字段',
              path: 'customField',
              key: 'customField',
            },
          ],
        },
        {
          name: '人事管理',
          path: '/personnel',
          key: 'personnel',
          children: [
            {
              name: '自定义模块',
              path: 'customField',
              key: 'customField',
            },
          ],
        },
        {
          name: '薪资设置',
          path: '/salary',
          key: 'salary',
          children: [
            {
              name: '计薪设置',
              path: 'payrollSetting',
              key: 'payrollSetting',
            },
            {
              name: '薪资项设置',
              path: 'salarySetting',
              key: 'salarySetting',
            },
            {
              name: '五险一金设置',
              path: 'insuranceSetting',
              key: 'insuranceSetting',
            },
            {
              name: '报税设置',
              path: 'taxSetting',
              key: 'taxSetting',
            },
          ],
        },
      ],
    },
  ],
};
