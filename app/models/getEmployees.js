import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { EmployeeService } from '../services/employee';

const employeeService = new EmployeeService();

const {
  getEmployees,
} = employeeService;

const NAMESPACE = 'getEmployees';

const ACTION_NAMES = new Actions({
  GET_ON_BOARD_STAFFS_LIST_FORMAL: null,
  GET_ON_BOARD_STAFFS_LIST_PROBATION: null,
  GET_RESIGNED_EMPLOYEES: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 获取正式员工列表
  [ACTION_NAMES.GET_ON_BOARD_STAFFS_LIST_FORMAL]: {
    servers: getEmployees.bind(employeeService),
    reducerName: 'onBoardStaffsList_formal',
    reducer: merge2State('onBoardStaffsList_formal'),
  },

  // 获取待转正员工列表
  [ACTION_NAMES.GET_ON_BOARD_STAFFS_LIST_PROBATION]: {
    servers: getEmployees.bind(employeeService),
    // onBoardStaffsList_formal: null,
    reducerName: 'onBoardStaffsList_probation',
    reducer: merge2State('onBoardStaffsList_probation'),
  },

  // 获取离职员工列表
  [ACTION_NAMES.GET_RESIGNED_EMPLOYEES]: {
    servers: getEmployees.bind(employeeService),
    reducerName: 'resignedEmployees',
    reducer: merge2State('resignedEmployees'),
  },

})

export default {
  namespace: NAMESPACE,

  state: {
    onBoardStaffsList_formal: null,
    onBoardStaffsList_probation: null,
    resignedEmployees: null,
  },

  effects: {
    ...effects,
  },
  reducers: {
    ...reducers,
  },
}
