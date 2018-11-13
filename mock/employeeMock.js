const {
  map200Data,
} = require('./utils');

const employeeHistory = [{
    content: '员工入职',
    remark: '',
    date: '2018-08-01',
  },
  {
    content: '员工转正',
    remark: '于*年*月*日进入公司，根据公司的需要，目前担任**一职，负责**********工作。工作认真、细心且具有较强的责任心和进取心，勤勉不懈，极富工作热情；性格开朗，乐于与他人沟通，具有良好和熟练的沟通技巧，有很强的团队协作能力；责任感强，确实完成领导交付的工作，和公司同公务员之家，全国公务员共同天地事之间能够通力合作，关系相处融洽而和睦，配合各部门负责人成功地完成各项工作；积极学习新知识、技能，注重自身发展和进步。',
    date: '2018-08-10',
  },
  {
    content: '员工调岗',
    remark: '适应各种工作',
    date: '2018-08-20',
  },
  {
    content: '员工离职',
    remark: '薪水太少',
    date: '2018-08-30',
  },
];

const employeeResignationInfo = {
  date: '2018-08-08', // 离职日期
  handoverMan: {
    id: 2,
    name: '李四',
  }, // 离职交接人
  reason: '心太累，钱太少', // 离职原因
  fileName: '离职信.doc', // 附件名称
  attachment: '', // 附件：离职信
};

const positionList = [{
    id: 1,
    name: '总经理',
    gradeId: 2,
    gradeName: 'M1',
  },
  {
    id: 3,
    name: '办事员',
    gradeId: 4,
    gradeName: 'P2',
  },
  {
    id: 5,
    name: '设计师',
    gradeId: 6,
    gradeName: 'T3',
  },
];

const employeeMenus = [{
    id: 1,
    name: '张三',
  },
  {
    id: 2,
    name: '李四',
  },
  {
    id: 3,
    name: '王五',
  },
];

const customizedFormsLayout = {
  position: [{
    id: 1,
    code: 'position',
    title: '岗位信息',
    multiRecord: true,
    required: true,
    onBoard: true,
    fields: [{
        fieldType: 'text_area',
        fieldId: 8,
        attribute: {
          required: false,
          label: '自定义多行',
          placeholder: '请选择',
        },
      },
      {
        fieldType: 'text_field',
        fieldId: 9,
        attribute: {
          required: false,
          label: '自定义单行',
          placeholder: '请选择',
        },
      },
    ],
  } ],
  basic: [{
      id: 1,
      code: 'workInfo',
      title: '工作信息',
      multiRecord: false,
      required: true,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 2,
      code: 'contractInfos',
      title: '合同管理',
      multiRecord: true,
      required: true,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 3,
      code: 'identities',
      title: '证件信息',
      multiRecord: true,
      required: true,
      onBoard: true,
      fields: [],
      active: true,
    },
  ],
  other: [{
      id: 1,
      code: 'contacts',
      title: '联系信息',
      multiRecord: true,
      required: true,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 2,
      code: 'emergencyContacts',
      title: '紧急联系人',
      multiRecord: false,
      required: true,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 3,
      code: 'educations',
      title: '教育信息',
      multiRecord: true,
      required: true,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 4,
      code: 'workExperiences',
      title: '工作经历',
      multiRecord: true,
      required: false,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 5,
      title: '附件模块',
      code: 'annex',
      multiRecord: true,
      required: false,
      onBoard: true,
      fields: [],
      active: true,
    },
    {
      id: 6,
      title: '其他模块',
      multiRecord: true,
      required: false,
      onBoard: true,
      fields: [],
      active: true,
    },
  ],
};

const employeeDetail = {
  id: 1,
  employeeNo: '123',
  mobile: '13300001111',
  avatar: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  gender: 'male',
  birthday: '2018-01-01',
  customizedForms: [{
    id: 1,
    formData: [{
        field1: 'value1',
      },
      {
        field2: 'value2',
      },
    ],
  } ],
  positionInfo: {
    position: [{
      startDate: '2018-01-01',
      endDate: '2018-01-01',
      company: {
        id: 1,
        name: 'name1',
      },
      department: {
        id: 1,
        name: 'name1',
      },
      position: {
        id: 1,
        name: 'name1',
      },
      leader: {
        id: 1,
        name: 'name1',
      },
      grade: {
        id: 1,
        name: 'name1',
      },
      customizedFields: {
        field1: 'value1',
      },
    } ],
  },
  baseInfo: {
    workInfo: {
      hireDate: '2018-01-01',
      workDate: '2018-01-01',
      type: 'probation',
      status: '',
    },
    contractInfos: [{
      signUnit: '',
      period: 0,
      startDate: '2018-01-01',
      endDate: '2018-01-01',
      probationEndDate: '2018-01-01',
      customizedFields: {
        field1: 'value1',
      },
    } ],
    identities: [{
      type: 0,
      code: '',
      customizedFields: {
        field1: 'value1',
      },
    } ],
  },
  otherInfo: {
    contacts: [{
      type: 0,
      content: '',
    } ],
    emergencyContacts: [{
      name: '',
      relationship: '',
      mobile: '',
    } ],
    educations: [{
      startTime: '2018-01-01',
      endTime: '2018-01-01',
      school: '',
      education: '',
      fullTime: 0,
      highest: 0,
      degree: '',
      customizedFields: {
        field1: 'value1',
      },
    } ],
    workExperiences: [{
      startTime: '2018-01-01',
      endTime: '2018-01-01',
      workUnit: '',
      jobPosition: '',
      leaveReason: '',
    } ],
    annex: [{
      annexfile: '',
    } ],
  },
};

const employeePermission = {
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
  // 获取员工历史
  app.get('/api/employees/:id/history', (req, res) => {
    res.send(map200Data(employeeHistory)); // employeeHistory
  });
  // 获取员工离职信息
  app.get('/api/employees/:id/resignation', (req, res) => {
    res.send(map200Data(employeeResignationInfo)); // employeeResignationInfo
  });
  // 获取员工入职表单结构定义
  app.get('/api/employees/customized_forms/layout', (req, res) => {
    res.send(map200Data(customizedFormsLayout)); // employeeLayout
  });
  // 员工转正
  app.put('/api/employees/:id/qualify', (req, res) => {
    res.send(map200Data()); // employeeQualify
  });
  // 岗位列表
  app.get('/api/department/:id/positions', (req, res) => {
    res.send(map200Data(positionList)); // positionList
  });
  // 所有员工列表
  app.get('/api/employees/option', (req, res) => {
    res.send(map200Data(employeeMenus)); // employeeList
  });
  // 员工调岗
  app.put('/api/employees/:id/transfer', (req, res) => {
    res.send(map200Data()); // employeeTransfer
  });
  // 员工离职
  app.put('/api/employees/:id/resignation', (req, res) => {
    res.send(map200Data()); // employeeResignation
  });
  // 获取员工详情
  app.get('/api/employees/:id', (req, res) => {
    res.send(map200Data(employeeDetail)); // employeeDetail
  });
  // 获取员工权限信息
  app.get('/api/employees/:id/permission', (req, res) => {
    if (req.params.id === 'me') {
      res.send(map200Data({superAdmin: true, permission: null}));
    } else {
      res.send(map200Data(employeePermission));
    }
  });
}
