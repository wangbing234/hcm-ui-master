import { transformMap2Options } from 'utils/utils';

import { FIELD_EMNU } from './field';

export const EMPLOYEE_STATUS = {
  PROBATION: 'probation', // 试用
  FORMAL: 'formal', // 正式
  FORMER: 'former', // 离职
};

export const EMPLOYEE_STATUS_MAP = {
  [EMPLOYEE_STATUS.FORMAL]: '正式',
  [EMPLOYEE_STATUS.FORMER]: '离职',
  [EMPLOYEE_STATUS.PROBATION]: '试用',
};

export const EMPLOYEE_STATUS_OPTIONS = transformMap2Options(EMPLOYEE_STATUS_MAP);

const EMPLOYEE_TYPES = {
  TRAINEE: 'trainee',
  LABOR: 'labor',
  LABORCONTRACT: 'laborContract',
  DISPATCH: 'dispatch',
  RETIREMENT: 'retirement',
};

export const EMPLOYEE_TYPE_MAP = {
  [EMPLOYEE_TYPES.TRAINEE]: '实习',
  [EMPLOYEE_TYPES.LABOR]: '劳务',
  [EMPLOYEE_TYPES.LABORCONTRACT]: '劳动合同',
  [EMPLOYEE_TYPES.DISPATCH]: '派遣',
  [EMPLOYEE_TYPES.RETIREMENT]: '退休返聘',
};

const EMPLOYEE_TYPE_OPTIONS = transformMap2Options(EMPLOYEE_TYPE_MAP);

const DEGREE_TYPES = {
  BACHELOR: 'bachelor',
  MASTER: 'master',
  DOCTOR: 'doctor',
  POSTDOCTORAL: 'postdoctoral',
};
const DEGREE_TYPE_MAP = {
  [DEGREE_TYPES.BACHELOR]: '学士',
  [DEGREE_TYPES.MASTER]: '硕士',
  [DEGREE_TYPES.DOCTOR]: '博士',
  [DEGREE_TYPES.POSTDOCTORAL]: '博士后',
};
const DEGREE_TYPE_OPTIONS = transformMap2Options(DEGREE_TYPE_MAP);

const EDUCATION_TYPES = {
  SECONDARY_SPECIALIZED_SCHOOL: 'secondarySpecializedSchool',
  HIGH_SCHOOL: 'highSchool',
  COLLEGE: 'college',
  UNDERGRADUATE: 'undergraduate',
  MASTER: 'master',
  DOCTOR: 'doctor',
  POSTDOCTORAL: 'postdoctoral',
};
const EDUCATION_TYPE_MAP = {
  [EDUCATION_TYPES.SECONDARY_SPECIALIZED_SCHOOL]: '中专',
  [EDUCATION_TYPES.HIGH_SCHOOL]: '高中',
  [EDUCATION_TYPES.COLLEGE]: '大专',
  [EDUCATION_TYPES.UNDERGRADUATE]: '本科',
  [EDUCATION_TYPES.MASTER]: '硕士',
  [EDUCATION_TYPES.DOCTOR]: '博士',
  [EDUCATION_TYPES.POSTDOCTORAL]: '博士后',
};
const EDUCATION_TYPE_OPTIONS = transformMap2Options(EDUCATION_TYPE_MAP);

export const TREE_TYPE = {
  COMPANY: 'company', // 公司
  DEPARTMENT: 'department', // 部门
};

// 标准字段配置
export const DEFAULT_FIELD = {
  header: {
    name: {
      fieldType: FIELD_EMNU.TEXT,
      code: 'name',
      required: true,
      label: '姓名',
      placeholder: '请输入',
    },
    employeeNo: {
      fieldType: FIELD_EMNU.TEXT,
      code: 'employeeNo',
      required: true,
      label: '工号',
      placeholder: '请输入',
    },
    mobile: {
      fieldType: FIELD_EMNU.DECIMAL,
      code: 'mobile',
      required: true,
      label: '手机号（将作为员工登录账号）',
      placeholder: '请输入',
      mobile: true,
    },
    avatar: {
      code: 'avatar',
    },
    gender: {
      fieldType: FIELD_EMNU.SELECT,
      code: 'gender',
      required: true,
      label: '性别',
      placeholder: '请选择',
      options: [{
        value: "female",
        label: '女',
      }, {
        value: 'male',
        label: '男',
      }],
    },
    birthday: {
      fieldType: FIELD_EMNU.DATE,
      code: 'birthday',
      required: true,
      label: '生日',
      placeholder: '请选择',
    },
  },
  position: {
    position: [
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'startDate',
        required: true,
        label: '开始日期',
        placeholder: '请选择',
      },
      // {
      //   fieldType: FIELD_EMNU.DATE,
      //   code: 'endDate',
      //   required: true,
      //   label: '结束日期',
      //   placeholder: '请选择',
      // },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'company',
        required: true,
        label: '公司',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'department',
        required: true,
        label: '部门',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'position',
        required: true,
        label: '岗位',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'grade',
        required: false,
        label: '职级',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'leader',
        required: false,
        label: '直接主管',
        placeholder: '请选择',
      },
    ],
  },
  basic: {
    job: [
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'hireDate',
        required: true,
        label: '入职日期',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'workDate',
        required: true,
        label: '开始工作日期',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'type',
        required: true,
        label: '员工类型',
        placeholder: '请选择',
        options: EMPLOYEE_TYPE_OPTIONS,
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'status',
        required: true,
        label: '员工状态',
        placeholder: '请选择',
        options: EMPLOYEE_STATUS_OPTIONS,
      },
    ],
    contract: [
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'signUnit',
        required: true,
        label: '签约单位',
        placeholder: '请输入',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'period',
        required: true,
        label: '合同期限',
        placeholder: '请选择',
        options: [{
          value: 'year1',
          label: '一年',
        }, {
          value: 'year2',
          label: '两年',
        }, {
          value: 'year3',
          label: '三年',
        }, {
          value: 'year5',
          label: '五年',
        }, {
          value: 'unclear',
          label: '不固定',
        },  {
          value: 'customize',
          label: '自定义',
        } ],
      },
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'startDate',
        required: true,
        label: '合同开始日期',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'endDate',
        required: true,
        label: '合同结束日期',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'probationEndDate',
        // required: true,
        label: '试用期结束日期',
        placeholder: '请选择',
      },
    ],
    identity: [
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'type',
        required: true,
        label: '证件类型',
        placeholder: '请选择',
        options: [{
          value: 'identity',
          label: '身份证',
        }, {
          value: 'passport',
          label: '护照',
        } ],
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'code',
        required: true,
        label: '证件号码',
        placeholder: '请输入',
      },
    ],
  },
  other: {
    contact: [
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'type',
        required: true,
        label: '联系类型',
        placeholder: '请选择',
        options: [{
          value: 'address',
          label: '居住地',
        }, {
          value: 'residenceAddress',
          label: '户籍地址',
        }, {
          value: 'homePhone',
          label: '座机',
        }, {
          value: 'email',
          label: 'Email',
        } ],
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'content',
        required: true,
        // label: '详细地址',
        placeholder: '请输入',
      },
    ],
    emergencyContact: [
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'name',
        required: true,
        label: '姓名',
        placeholder: '请输入',
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'relationship',
        required: true,
        label: '关系',
        placeholder: '请输入',
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'mobile',
        required: true,
        label: '手机号',
        placeholder: '请输入',
        mobile: true,
      },
    ],
    education: [
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'startTime',
        required: true,
        label: '开始时间',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'endTime',
        required: true,
        label: '结束时间',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'school',
        required: true,
        label: '学校名称',
        placeholder: '请输入',
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'education',
        required: true,
        label: '学历',
        placeholder: '请选择',
        options: EDUCATION_TYPE_OPTIONS,
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'fullTime',
        required: true,
        label: '是否全日制',
        placeholder: '请选择',
        options: [{
          value: true,
          label: '是',
        }, {
          value: false,
          label: '否',
        } ],
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'highest',
        required: true,
        label: '是否最高学历',
        placeholder: '请选择',
        options: [{
          value: true,
          label: '是',
        }, {
          value: false,
          label: '否',
        } ],
      },
      {
        fieldType: FIELD_EMNU.SELECT,
        code: 'degree',
        required: false,
        label: '学位',
        placeholder: '请选择',
        options: DEGREE_TYPE_OPTIONS,
      },
    ],
    workExperience: [
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'startTime',
        required: true,
        label: '开始日期',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.DATE,
        code: 'endTime',
        required: true,
        label: '结束日期',
        placeholder: '请选择',
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'workUnit',
        required: true,
        label: '工作单位',
        placeholder: '请输入',
      },
      {
        fieldType: FIELD_EMNU.TEXT,
        code: 'jobPosition',
        required: true,
        label: '任职岗位',
        placeholder: '请输入',
      },
      {
        fieldType: FIELD_EMNU.TEXT_AREA,
        code: 'leaveReason',
        required: true,
        label: '离职原因',
        placeholder: '请输入',
      },
    ],
    // annex: [
    //   {
    //     fieldType: 'file',
    //     code: 'annexfile',
    //     required: true,
    //     label: '附件信息',
    //     placeholder: '请选择',
    //   },
    // ],
  },
};

export const SESSION_KEY = {
  HEADER: 'header',
  POSITION_INFO: 'positionInfo',
  BASIC_INFO: 'basicInfo',
  OTHER_INFO: 'otherInfo',
};

// 员工详情模块与表单结构外层名称映射
export const DETAIL_MAP_LAYOUT = {
  // 岗位信息
  [SESSION_KEY.POSITION_INFO]: 'position',
  // 基本信息
  [SESSION_KEY.BASIC_INFO]: 'basic',
  // 其他信息
  [SESSION_KEY.OTHER_INFO]: 'other',
};
