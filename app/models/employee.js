import * as Immutable from 'immutable';
import { flowRight } from 'lodash/util';

import { effectErrorForm } from 'utils/createError';
import { Actions, createActions } from 'utils/actionUtil';
import { merge2State, createModels } from 'utils/modelUtil';
import { wrapUniqueKey, getIdFromKey, tree2flat, removeDataBase64 } from '../utils/utils';
import { EmployeeService } from '../services/employee';
import { TREE_TYPE, DEFAULT_FIELD, DETAIL_MAP_LAYOUT, EMPLOYEE_STATUS_OPTIONS, EMPLOYEE_STATUS } from '../constants/employee';


const employeeService = new EmployeeService();

const NAMESPACE = 'employee';

const ACTION_NAMES = new Actions({
  UPDATE_ERROR: null,

  GET_EMPLOYEE_HISTORY_INFO: null,
  GET_EMPLOYEE_RESIGNATION_INFO: null,
  DOWNLOAD_FILE_BY_ID: null,

  CHANGE_EMPLOYEE_QUALIFY: null,
  DELETE_QUALIFY_ATTACHMENT: null,
  UPDATE_EMPLOYEE_QUALIFY_ERROR: null,
  CLEAR_EMPLOYEE_QUALIFY: null,
  SAVE_EMPLOYEE_QUALIFY: null,

  GET_COMPANY_TREE: null,
  CHANGE_EMPLOYEE_TRANSFER_FORM: null,
  GET_POSITIONS_LIST: null,
  GET_EMPLOYEE_MENUS: null,
  UPDATE_EMPLOYEE_TRANSFER_ERROR: null,
  SAVE_EMPLOYEE_TRANSFER: null,
  CLEAR_EMPLOYEE_TRANSFER: null,

  OPEN_EMPLOYEE_DETAIL: null,
  SET_EMPLOYEE_DETAIL: null,
  CREATE_EMPLOYEE: null,
  UPDATE_EMPLOYEE: null,
  SET_EMPLOYEE_LAYOUT: null,
  CHANGE_EMPLOYEE_RESIGNATION: null,
  DELETE_RESIGNATION_ATTACHMENT: null,
  UPDATE_EMPLOYEE_RESIGNATION_ERROR: null,
  CLEAR_EMPLOYEE_RESIGNATION: null,
  SAVE_EMPLOYEE_RESIGNATION: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({

  // 人事管理-获取员工历史记录
  [ACTION_NAMES.GET_EMPLOYEE_HISTORY_INFO]: {
    servers: employeeService.getEmployeeHistory,
    reducer: merge2State('employeeHistory'),
  },
  // 人事管理-获取员工离职信息
  [ACTION_NAMES.GET_EMPLOYEE_RESIGNATION_INFO]: {
    servers: employeeService.getEmployeeResignation,
    use: [convertToImmutable],
    reducer: merge2State('employeeResignation'),
  },
  // 人事管理-员工离职信息-下载离职信
  [ACTION_NAMES.DOWNLOAD_FILE_BY_ID]: {
    servers: employeeService.downloadFile,
  },
  // 员工转正
  [ACTION_NAMES.SAVE_EMPLOYEE_QUALIFY]: {
    servers: employeeService.saveEmployeeQualify,
    use: [notifyQualifyResult],
  },
  // 获取组织tree
  [ACTION_NAMES.GET_COMPANY_TREE]: {
    servers: employeeService.getCompanyTree,
    reducerName: 'setCompanyTree',
    use: [coverCompanyTree],
    reducer: merge2State('companyTree'),
  },
  // 获取岗位列表
  [ACTION_NAMES.GET_POSITIONS_LIST]: {
    servers: employeeService.getPositionList,
    reducerName: 'setPositionList',
    // reducer: merge2State('positionList'),
    reducer: getPositionList,
  },
  // 获取所有员工列表
  [ACTION_NAMES.GET_EMPLOYEE_MENUS]: {
    servers: employeeService.getEmployeeMenus,
    reducerName: 'setEmployeeMenus',
    reducer: merge2State('employeeMenus'),
  },
  // 员工调岗
  [ACTION_NAMES.SAVE_EMPLOYEE_TRANSFER]: {
    servers: employeeService.saveEmployeeTransfer,
    use: [notifyTransferResult],
  },
  // 员工离职
  [ACTION_NAMES.SAVE_EMPLOYEE_RESIGNATION]: {
    servers: employeeService.saveEmployeeResignation,
    use: [notifyResignationResult],
  },

  // 员工入职
  [ACTION_NAMES.CREATE_EMPLOYEE]: {
    servers: employeeService.entryEmployee,
  },

  // 员工更新
  [ACTION_NAMES.UPDATE_EMPLOYEE]: {
    servers: employeeService.updateEmployee,
  },
});

export default {
  namespace: NAMESPACE,

  state: {
    employeeHistory: null,
    employeeQualify: Immutable.fromJS({}),
    employeeQualifyErrors: Immutable.fromJS({}),
    isEmployeeQualify: false,

    employeeTransfer: Immutable.fromJS({}),
    employeeTransferErrors: Immutable.fromJS({}),
    companyTree: {},
    departmentTree: [],
    // positionList: [],
    positionListMap: {},
    employeeMenus: [],
    isEmployeeTransfer: false,

    employeeResignation: Immutable.fromJS({}),
    employeeResignationErrors: Immutable.fromJS({}),
    isEmployeeResignation: false,
  },

  effects: {
    ...effects,
    ...effectErrorForm(ACTION_NAMES.UPDATE_ERROR, NAMESPACE),
    // *[ACTION_NAMES.CHANGE_EMPLOYEE_QUALIFY]({ payload }, { put }) {
    //   yield put({
    //     type: 'changeEmployeeQualify',
    //     payload,
    //   });
    // },
    *[ACTION_NAMES.DELETE_QUALIFY_ATTACHMENT]({ payload }, { put }) {
      yield put({
        type: 'deleteQualifyAttachment',
        payload,
      });
    },
    *[ACTION_NAMES.UPDATE_EMPLOYEE_QUALIFY_ERROR]({ payload }, { put }) {
      yield put({
        type: 'updateQualifyError',
        payload,
      });
    },
    *[ACTION_NAMES.CLEAR_EMPLOYEE_QUALIFY]({ payload }, { put }) {
      yield put({
        type: 'clearQualify',
        payload,
      });
    },

    *[ACTION_NAMES.CHANGE_EMPLOYEE_TRANSFER_FORM]({ payload }, { put }) {
      yield put({
        type: 'changeEmployeeTransfer',
        payload,
      });
    },
    *[ACTION_NAMES.UPDATE_EMPLOYEE_TRANSFER_ERROR]({ payload }, { put }) {
      yield put({
        type: 'updateTransferError',
        payload,
      });
    },
    *[ACTION_NAMES.CLEAR_EMPLOYEE_TRANSFER]({ payload }, { put }) {
      yield put({
        type: 'clearTransfer',
        payload,
      });
    },

    // 打开员工详情浮层
    *[ACTION_NAMES.OPEN_EMPLOYEE_DETAIL]({ payload }, { call, put }) {
      // 清空上次信息
      yield put({
        type: ACTION_NAMES.SET_EMPLOYEE_DETAIL,
        payload: undefined,
      });
      yield put({
        type: ACTION_NAMES.SET_EMPLOYEE_LAYOUT,
        payload: undefined,
      });
      // 获取本次信息
      const [detail, layout, companyTree, employeeMenus ] = yield [
        payload ? call(employeeService.getEmployeeDetail, payload) : DETAULT_EMPLOYEE_DETAIL,
        call(employeeService.getEmployeeLayout),
        call(employeeService.getCompanyTree),
        call(employeeService.getEmployeeMenus),
      ];

      yield put({
        type: 'setCompanyTree',
        payload: coverCompanyTree(companyTree),
      });

      let defaultFieldImmu = Immutable.fromJS(DEFAULT_FIELD);
      if( !payload ) {
        const JOB_PATH = ['basic', 'job'];
        const JOB_STATUS_OPTIONS_PATH = JOB_PATH.concat(
          defaultFieldImmu.getIn(JOB_PATH).findIndex( field => field.get('code') === 'status' ),
          'options',
        );
        defaultFieldImmu = defaultFieldImmu.setIn(
          JOB_STATUS_OPTIONS_PATH,
          EMPLOYEE_STATUS_OPTIONS.filter( ({value}) => value !== EMPLOYEE_STATUS.FORMER )
        );
      }

      // 获取格式化本次信息并保存
      const UILayout = mapAPI2UI4ConfigableField( layout, defaultFieldImmu.toJS() );
      let UIData = normalizeData(DETAIL_MAP_LAYOUT, detail, UILayout);
      const POSITION_PATH = ['positionInfo', 'position'];
      const posListArr = [];
      if( payload && UIData.getIn( POSITION_PATH ) ) {
        const extraArr = (yield UIData.getIn( POSITION_PATH ).toJS()
          .filter( ({departmentId}) => departmentId )
          // 获取岗位信息
          .map( ({departmentId}) => call(employeeService.getPositionList,  {id: departmentId} ) )
          )
        // 组合信息
          .map( ( posList, idx ) => {
            const flatCompanyTree = tree2flat([companyTree]);
            const { companyId, departmentId, positionId, leaderId } = UIData.getIn( POSITION_PATH.concat(idx) ).toJS();
            const { id, name, gradeId, gradeName } = (posList.find( pos => pos.id === positionId ) || {});
            const company = (flatCompanyTree.find( node => node.type === TREE_TYPE.COMPANY && node.id === companyId ) || {});
            const department = (flatCompanyTree.find( node => node.type === TREE_TYPE.DEPARTMENT && node.id === departmentId ) || {});
            const leaderName = (employeeMenus.find( empl => empl.id === leaderId ) || {}).name;

            posListArr.push({
              id: departmentId,
              posList,
            });

            return {
              company: wrapUniqueKey( TREE_TYPE.COMPANY, companyId, company.name ),
              companyName: company.name,
              department: department.name ? wrapUniqueKey( TREE_TYPE.DEPARTMENT, departmentId, department.name ) : undefined,
              departmentName: department.name,
              position: id,
              positionName: name,
              grade: gradeId,
              gradeName,
              leader: leaderName ? leaderId : undefined,
              leaderName,
            };
          } );

        yield extraArr.map( ({company}) => put({
          type: 'changeEmployeeTransfer',
          payload: {
            type: TREE_TYPE.COMPANY,
            value: company,
          },
        }) ).concat(
          posListArr.map( ({id, posList}) =>
            put({
              type: 'setPositionList',
              payload: posList,
              meta: {
                id,
              },
            })
          )
        )

        UIData =  UIData.setIn(
          POSITION_PATH,
          UIData.getIn(POSITION_PATH).map( (pos, idx) => pos.merge(Immutable.fromJS(extraArr[idx])) ),
        );
      }
      yield put({
        type: ACTION_NAMES.SET_EMPLOYEE_DETAIL,
        payload: UIData,
      });
      yield put({
        type: ACTION_NAMES.SET_EMPLOYEE_LAYOUT,
        payload: UILayout,
      });
      yield put({
        type: 'setEmployeeMenus',
        payload: employeeMenus,
      });
    },

    *[ACTION_NAMES.CHANGE_EMPLOYEE_RESIGNATION]({ payload }, { put }) {
      yield put({
        type: 'changeEmployeeResignation',
        payload,
      });
    },
    *[ACTION_NAMES.DELETE_RESIGNATION_ATTACHMENT]({ payload }, { put }) {
      yield put({
        type: 'deleteResignationAttachment',
        payload,
      });
    },
    *[ACTION_NAMES.UPDATE_EMPLOYEE_RESIGNATION_ERROR]({ payload }, { put }) {
      yield put({
        type: 'updateResignationError',
        payload,
      });
    },
    *[ACTION_NAMES.CLEAR_EMPLOYEE_RESIGNATION]({ payload }, { put }) {
      yield put({
        type: 'clearResignation',
        payload,
      });
    },
  },

  reducers: {
    ...reducers,
    // 员工转正表单-onChange
    [ACTION_NAMES.CHANGE_EMPLOYEE_QUALIFY]: (state, { payload }) => {
      const { employeeQualify } = state;
      const { type, value } = payload;
      const newData = employeeQualify.set(type, value);
      return {
        ...state,
        employeeQualify: newData,
      };
    },
    // 员工转正表单-删除附件
    deleteQualifyAttachment(state) {
      const { employeeQualify } = state;
      const newData = employeeQualify.delete('fileName').delete('attachment');
      return {
        ...state,
        employeeQualify: newData,
      };
    },
    // 员工转正表单-更新错误
    updateQualifyError(state, { payload }) {
      return {
        ...state,
        employeeQualifyErrors: payload,
      };
    },
    // 员工转正表单-清空表单与错误
    clearQualify(state) {
      return {
        ...state,
        employeeQualify: Immutable.fromJS({}),
				employeeQualifyErrors: Immutable.fromJS({}),
				isEmployeeQualify: false,
      };
    },
    // 员工转正表单-员工转正是否成功
    updateEmployeeQualifyStatus(state, { payload }) {
      return {
        ...state,
        isEmployeeQualify: payload,
      };
    },

    // 员工调岗表单-onChange
    changeEmployeeTransfer(state, { payload }) {
      const { employeeTransfer, companyTree, departmentTree, positionListMap } = state;
      const { type, value } = payload;
      let newEmployeeTransfer = employeeTransfer.set(type, value);

      let newDepartmentTree = departmentTree;
      if (type === TREE_TYPE.COMPANY) {
        // 更新部门树
        newDepartmentTree = getDepartmentTree([companyTree], value);
        newDepartmentTree = formatDepartmentTree(newDepartmentTree);
        // 删除“新的部门”与“新的岗位”、“职级”
        newEmployeeTransfer = newEmployeeTransfer
          .delete('department')
          .delete('positionId')
          .delete('gradeId')
          .delete('gradeName');
      }

      if (type === TREE_TYPE.DEPARTMENT) {
        // 删除“新的岗位”、“职级”
        newEmployeeTransfer = newEmployeeTransfer
          .delete('positionId')
          .delete('gradeId')
          .delete('gradeName');
      }

      if (type === 'positionId') {
        const position = (positionListMap[getIdFromKey(newEmployeeTransfer.get('department'))] || []).find(item => item.id === value);
        // 添加职级数据
        newEmployeeTransfer = newEmployeeTransfer
          .set('gradeId', position.gradeId)
          .set('gradeName', position.gradeName);
      }

      return {
        ...state,
        employeeTransfer: newEmployeeTransfer,
        departmentTree: newDepartmentTree,
      };
    },
    // 员工调岗表单-更新错误
    updateTransferError(state, { payload }) {
      return {
        ...state,
        employeeTransferErrors: payload,
      };
    },
    // 员工调岗表单-员工调岗是否成功
    updateEmployeeTransferStatus(state, { payload }) {
      return {
        ...state,
        isEmployeeTransfer: payload,
      };
    },
    // 员工调岗表单-清空表单与错误
    clearTransfer(state) {
      return {
        ...state,
        employeeTransfer: Immutable.fromJS({}),
        employeeTransferErrors: Immutable.fromJS({}),
        // companyTree: {},
        departmentTree: [],
        // positionListMap: {},
        // employeeMenus: [],
        isEmployeeTransfer: false,
      };
    },

    [ACTION_NAMES.SET_EMPLOYEE_DETAIL]: merge2State('detail'),
    [ACTION_NAMES.SET_EMPLOYEE_LAYOUT]: merge2State('layout'),
    // 员工离职表单-onChange
    changeEmployeeResignation(state, { payload }) {
      const { employeeResignation } = state;
      const { type, value } = payload;
      const newData = employeeResignation.set(type, value);
      return {
        ...state,
        employeeResignation: newData,
      };
    },
    // 员工离职表单-删除附件
    deleteResignationAttachment(state) {
      const { employeeResignation } = state;
      const newData = employeeResignation.delete('fileName').delete('attachment');
      return {
        ...state,
        employeeResignation: newData,
      };
    },
    // 员工离职表单-更新错误
    updateResignationError(state, { payload }) {
      return {
        ...state,
        employeeResignationErrors: payload,
      };
    },
    // 员工离职表单-清空表单与错误
    clearResignation(state) {
      return {
        ...state,
        employeeResignation: Immutable.fromJS({}),
        employeeResignationErrors: Immutable.fromJS({}),
        employeeMenus: [],
        isEmployeeResignation: false,
      };
    },
    // 员工离职表单-员工离职是否成功
    updateEmployeeResignationStatus(state, { payload }) {
      return {
        ...state,
        isEmployeeResignation: payload,
      };
    },
  },
};

function* notifyQualifyResult(res, action, { put }) {
  yield put({
    type: 'updateEmployeeQualifyStatus',
    payload: true,
  });
  return res;
}

function coverCompanyTree({ id, name, children, type }) {
  const key = wrapUniqueKey(type, id, name);
  return {
    type,
    title: name,
    value: key,
    key,
    disabled: type !== TREE_TYPE.COMPANY,
    children: children && children.map(coverCompanyTree),
  };
}

/*

fix bug #420 By Law
http://jira.youzhao.io/browse/HCM-420

*/
function formatDepartmentTree(array, idx = 0) {
  return array.map(item => {
    const newItem = item;
    if (item.type === TREE_TYPE.DEPARTMENT && idx === 0) {
      newItem.disabled = false;
    } else {
      newItem.disabled = true;
    }
    if (newItem.children && newItem.children.length > 0) {
      formatDepartmentTree(newItem.children, idx + 1);
    }
    return newItem;
  });
}

function getDepartmentTree(array, value) {
  let res = [];
  const loop = (data, key) => {
    Immutable.fromJS(data).map(item => {
      if (item.get('value') === key) {
        res = item.get('children').toJS();
        return res;
      } else {
        return loop(item.get('children'), key);
      }
    });
  };
  loop(array, value);
  return res;
}

function* notifyTransferResult(res, action, { put }) {
  yield put({
    type: 'updateEmployeeTransferStatus',
    payload: true,
  });
  return res;
}

// 将包含字段的API对象映射为使用ConfigableField支持的对象
function mapAPI2UI4SingleEntry({ id, fields, ...other }) {
  return {
    ...other,
    id,
    fields: fields.map(config => {
      const { fieldType, attribute } = config;
      return {
        fieldId: config.id,
        fieldType,
        ...attribute,
      }
    }),
  };
}

// 在自定义字段前成插入标准字段配置
function insertDefaultField(defaultField = {}) {
  return ({ fields, id, code, ...other }) => ({
    ...other,
    id: code || id,
    fields: (defaultField[code] || []).concat(fields),
  });
}

// 将自定义模块的API对象映射为UI通用的对象
function mapAPI2UI4ConfigableField(apiData, defaultField) {
  return {
    header: defaultField.header,
    ...objMap(apiData, (val, key) =>
      val.map(
        flowRight(
          insertDefaultField(defaultField[key]),
          mapAPI2UI4SingleEntry
        )
      )
    ),
  };
}

// 初始化信息
const DETAULT_EMPLOYEE_DETAIL = {
  customizedForms: [],
  positionInfo: {
    position: [],
  },
  basicInfo: {
    job: {},
    contract: [],
    identity: [],
  },
  otherInfo: {
    contact: [],
    emergencyContact: [],
    education: [],
    workExperience: [],
  },
};

// 根据原对象，在不改变key的情况下，对value进行处理，返回新的对象
function objMap(obj, cb) {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    newObj[key] = cb(obj[key], key);
  });
  return newObj;
}

// 将包含id和name的对象取出id并赋值，如"company": 1,
const getValFromId = obj => {
  const newObj = {};
  Object.keys(obj).forEach( key => {
    const target = obj[key];
    if(target && typeof target === 'object' && target.id) {
      const { id, name } = target;
      newObj[key] = id;
      newObj[`${key}Name`] = name;
    } else {
      newObj[key] = target;
    }
  } )
  return newObj
}

export function getBasicDate(fields = []) {
  const basicDate = {};
  fields.forEach( ({fieldId, code}) => {
    basicDate[code || fieldId] = undefined;
  } );
  return basicDate;
}

/*
格式化员工详情API对象用于UI显示
*/
function normalizeData(dataMapLayout, fullData, fullLayout) {
  const { ...headerInfo } = fullData;
  // 获取header信息
  delete headerInfo.customizedForms;
  Object.keys(dataMapLayout).forEach(key => {
    delete headerInfo[key];
  });

  return Immutable.fromJS({
    ...objMap(dataMapLayout, (val, key) => {
      const data = fullData[key];
      const layout = fullLayout[val];
      const normalizedData = {};

      layout.forEach(({ id, required, fields} ) => {
        // 必填时默认提供一个空数据
        if (required) {
          normalizedData[id] = [getBasicDate(fields)];
        } else {
          normalizedData[id] = [];
        }
        let currentData = data && data[id];
        // 有标准数据时
        if (currentData) {
          if (!(currentData instanceof Array)) {
            currentData = [
              {
                ...getBasicDate(fields),
                ...currentData,
              },
            ];
          }
          if (currentData.length) {
            normalizedData[id] = currentData.map(({ customizedFields, ...other }) => ({
              ...getBasicDate(fields),
              ...getValFromId(other),
              ...customizedFields,
            }));
          }
        } else {
          const { customizedForms } = fullData;
          const customizedForm = customizedForms && customizedForms.find(({formId}) => formId === id);
          // 有自定义数据时
          if (customizedForms && customizedForm) {
            normalizedData[id] = customizedForm.formData.map(itemData => ({
              ...getBasicDate(fields),
              ...itemData,
            }));
          }
        }
      });
      return normalizedData;
    }),
    ...{
      header: {
        ...getBasicDate(Object.keys(fullLayout.header).map( key => fullLayout.header[key] )),
        ...headerInfo,
      },
    },
  });
}

/*
格式化员工详情UI对象用于API保存
*/
export function denormalizeData(normalizedData, fullLayout) {
  let customizedForms = [];
  const { avatar, ...header } = normalizedData.get('header').toJS();
  return {
    ...objMap(DETAIL_MAP_LAYOUT, (val, key) => {
      const denormalizedData = {};
      objMap(normalizedData.get(key).toJS(), (formData , id ) => {
        // 标准数据
        if( isNaN(id) ) {
          denormalizedData[id] = denormalizeStandardForms(formData, id, fullLayout, key);
        // 自定义数据
        } else {
          customizedForms = customizedForms.concat(denormalizeCustomizedForms(formData, +id));
        }
      })

      return denormalizedData;
    }),
    ...header,
    avatar: removeDataBase64(avatar) || '0',
    customizedForms,
  };
}

function positionForm( id, form ) {
  if( id === 'position' ) {
    const { company, companyName, department, departmentName, position, positionName, leader, leaderName, grade, gradeName, ...other } = form;
    const newForm = other;
    newForm.companyId = getIdFromKey(company);
    newForm.departmentId = getIdFromKey(department);
    newForm.positionId = position;
    newForm.leaderId = leader;
    return newForm;
  } else {
    return form;
  }
}

export function denormalizeStandardForms(formDatas, id, fullLayout, sessionName ) {
  const denormalizedData = formDatas.map(({_key, ...omitKey}) => positionForm(id, omitKey))
  .map( formData => {
    const customizedFields = {};
    const standardFields = {};
    Object.keys(formData).forEach( key => {
      if( isNaN(key) ) {
        standardFields[key] = formData[key];
      } else {
        customizedFields[key] = formData[key];
      }
    } );
    standardFields.customizedFields = customizedFields;
    return standardFields;
  } );
  const currentLayout = fullLayout[DETAIL_MAP_LAYOUT[sessionName]].find( layout => (layout.id === id || layout.id === id) );
  const { multiRecord } = currentLayout || {};
  if( !multiRecord && id !== 'emergencyContact' ) {
    return denormalizedData[0];
  }
  return denormalizedData;
}

export function denormalizeCustomizedForms(formDatas, id) {
  return {
    formId: id,
    formData: formDatas.map(({_key, ...other}) => other).filter( formData => Object.keys(formData).length ),
  }
}

function* notifyResignationResult(res, action, { put }) {
    yield put({
      type: 'updateEmployeeResignationStatus',
      payload: true,
    });
  return res;
}

function convertToImmutable(data) {
  return Immutable.fromJS(data);
}

// 获取岗位列表
function getPositionList(state, { payload, meta }) {
  const { positionListMap } = state;
  return {
    ...state,
    positionListMap: {
      ...positionListMap,
      [meta.id]: payload,
    },
  };
};
