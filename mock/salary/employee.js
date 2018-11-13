const { map200Data } = require('../utils');

const EMPLOYEES = {
  "content": [
    {
      "id": 1,
      "name": "劳伦斯",
      "avatar": "http://image.biaobaiju.com/uploads/20180122/15/1516605100-gbcFJQXrul.jpg",
      "companyName": "武汉奇点",
      "departmentName": "设计一部",
      "employeeNo": "1111",
      "status": "formal",
      "hireDate": "2018-05-01",
      "resignationDate": "2019-05-01",
      "salary": 10000.00,
    },
  ],
  "first": true,
  "last": true,
  "number": 0,
  "numberOfElements": 0,
  "pageable": {
    "offset": 0,
    "pageNumber": 1,
    "pageSize": 2,
    "paged": true,
    "sort": {
      "sorted": true,
      "unsorted": true,
    },
    "unpaged": true,
  },
  "size": 0,
  "sort": {
    "sorted": true,
    "unsorted": true,
  },
  "totalElements": 0,
  "totalPages": 0,
};

const BASIC = {
  avatar: 'http://image.biaobaiju.com/uploads/20180122/15/1516605100-gbcFJQXrul.jpg',
  company: '上海奇点人才',
  department: '设计开发组',
  employeeNo: '00000010',
  grade: 'P-8',
  hireDate: '2018-11-11',
  mobile: '186-0487-2509',
  name: '劳伦斯',
  position: 'UI设计师',
  status: 'formal',
  type: 'labor',
};

const MONTHLY_DETAIL = [
  {
    "id": 1,
    "code": "dutyDays",
    "name": "出勤天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 2,
    "code": "affairDays",
    "name": "事假天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 3,
    "code": "extraDays",
    "name": "加班天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 4,
    "code": "absentDays",
    "name": "旷工天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 5,
    "code": "sickDays",
    "name": "病假天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 6,
    "code": "longSickDays",
    "name": "长病假天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 7,
    "code": "workDays",
    "name": "本月工作日",
    "value": null,
    "modified": null,
  },
  {
    "id": 8,
    "code": "monthDays",
    "name": "本月天数",
    "value": null,
    "modified": null,
  },
  {
    "id": 9,
    "code": "salary",
    "name": "基本工资",
    "value": null,
    "modified": null,
  },
  {
    "id": 10,
    "code": "grossPay",
    "name": "应发工资",
    "value": null,
    "modified": null,
  },
  {
    "id": 11,
    "code": "personalSocialSecurity",
    "name": "社保（个人）合计",
    "value": null,
    "modified": null,
  },
  {
    "id": 12,
    "code": "taxSalary",
    "name": "计税工资",
    "value": null,
    "modified": null,
  },
  {
    "id": 13,
    "code": "grossSalary",
    "name": "应税工资",
    "value": null,
    "modified": null,
  },
  {
    "id": 14,
    "code": "tax",
    "name": "个税",
    "value": null,
    "modified": null,
  },
  {
    "id": 15,
    "code": "afterTaxSalary",
    "name": "实发工资",
    "value": null,
    "modified": null,
  },
  {
    "id": 16,
    "code": "personalPensionEmployer",
    "name": "养老保险（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 17,
    "code": "personalOutwork",
    "name": "失业保险（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 18,
    "code": "personalHistoryEmployer",
    "name": "医疗保险（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 19,
    "code": "personalInjury",
    "name": "工伤保险（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 20,
    "code": "personalBirth",
    "name": "生育保险（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 21,
    "code": "personalBasicHousingFund",
    "name": "基本公积金（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 22,
    "code": "personalAddingHousingFund",
    "name": "补充公积金（个人）",
    "value": null,
    "modified": null,
  },
  {
    "id": 23,
    "code": "personalHousingFund",
    "name": "公积金（个人）合计",
    "value": null,
    "modified": null,
  },
  {
    "id": 24,
    "code": "employerPensionEmployer",
    "name": "养老保险（公司）",
    "value": null,
    "modified": null,
  },
  {
    "id": 25,
    "code": "employerOutwork",
    "name": "失业保险（公司）",
    "value": null,
    "modified": null,
  },
  {
    "id": 26,
    "code": "employerHistory",
    "name": "医疗保险（公司）",
    "value": null,
    "modified": null,
  },
  {
    "id": 28,
    "code": "employerBirth",
    "name": "生育保险（公司）",
    "value": null,
    "modified": null,
  },
];

const SALARY_INFO = {
  "bankInfo": {
    "bankAddress": "string",
    "bankName": "string",
    "cardNo": "123123",
  },
  "threshold": {
    "id": 0,
    "name": "string",
    "point": 0,
    "type": "chinese",
  },
};

const SECURITY_INFO = {
  "employeeHousingFundPlan": {
    "account": "string",
    "fundAddingPersonalRatio": 0,
    "fundPersonalRatio": 0,
    "housingFundBase": 0,
    "name": "string",
    "socialSecurityBase": 0,
  },
  "employeeSecurityPlan": {
    "birthPersonalRatio": 0,
    "historyPersonalRatio": 0,
    "injuryPersonalRatio": 0,
    "name": "string",
    "outworkPersonalRatio": 0,
    "pensionPersonalRatio": 0,
    "socialSecurityBase": 0,
  },
};

const HISTORY = [
  {
      "adjustDate": "2018-07-21",
      "afterAdjust": 3000,
      "type": "basic",
      "increased": 170,
      "beforeAdjust": 8000,
  },
  {
      "adjustDate": "2019-03-21",
      "afterAdjust": 8000,
      "type": "basic",
      "increased": 125,
      "beforeAdjust": 18000,
  },
];

module.exports = (app) => {
	// 获取本月员工薪酬列表
	app.get('/api/salaries/employees', (req, res) => {
		res.send(map200Data(EMPLOYEES));
  });
	// 获取本月员工基本信息
	app.get('/api/salaries/employees/:employeeId/basic', (req, res) => {
		res.send(map200Data(BASIC));
  });
	// 获取本月明细
	app.get('/api/salaries/employees/:employeeId/monthly_detail', (req, res) => {
		res.send(map200Data(MONTHLY_DETAIL));
  });
	// 获取薪酬信息
	app.get('/api/salaries/employees/:employeeId/salary_info', (req, res) => {
		res.send(map200Data(SALARY_INFO));
  });
	// 获取五险一金
	app.get('/api/salaries/employees/:employeeId/security_info', (req, res) => {
		res.send(map200Data(SECURITY_INFO));
  });
	// 获取薪酬历史记录
	app.get('/api/salaries/employees/:employeeId/history', (req, res) => {
		res.send(map200Data(HISTORY));
  });
}
