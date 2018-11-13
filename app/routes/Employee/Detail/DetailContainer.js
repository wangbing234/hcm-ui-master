import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import immutable from 'immutable';
import moment from 'moment';
import { connect } from 'dva';
import { flatten } from 'lodash/array';
import { snakeCase } from 'lodash/string';

import { DETAIL_MAP_LAYOUT } from 'constants/employee';

import { getIdFromKey, removeDataBase64 } from 'utils/utils';
import { createPromiseDispatch } from 'utils/actionUtil';

import { actions, getBasicDate, denormalizeData, denormalizeStandardForms } from 'models/employee';

import Button from 'components/Base/Button';
import Spinner from 'components/Spinner';

import Detail from './Detail';
import Entry from './Entry';
import Content from './Content';
import SideBar from './SideBar';
import DetailDialog from './DetailDialog';
import getError, { getChangeCardNumError } from './getError';
import { removeEmptyError, getServiceError } from './getError/utils';
import { PermissionContext } from './Permission';

import StaffOperation from '../StaffOperation';
import History from '../History';
import ResignationInfo from '../ResignationInfo';

const {
  UPDATE_ERROR,
  OPEN_EMPLOYEE_DETAIL,
  GET_POSITIONS_LIST,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  SET_EMPLOYEE_DETAIL,
  GET_EMPLOYEE_HISTORY_INFO,
} = actions;

function flatObj2Arr(obj, path) {
  if( typeof obj === 'object' && obj ) {
    if( obj instanceof Array ) {
      return flatten(obj.map((item, idx) => flatObj2Arr(item, path.concat(idx))));
    } else {
      return flatten(Object.keys(obj).map( key => flatObj2Arr(obj[key], path.concat(`${key}`))));
    }
  }
  return {
    path,
    value: obj,
  };
}

@connect(({ employee = {}, error = {} }) => ({
  error: error.employee,
  data: employee.detail,
  layout: employee.layout,
  positionListMap: employee.positionListMap,
  employeeMenus: employee.employeeMenus,
}))
export default class DetailContainer extends PureComponent {

  static propTypes = {
    id: PropTypes.any, // 员工id, 新增不传
    enableEdit: PropTypes.bool,
    open: PropTypes.bool, // 是否展示浮层
    onClose: PropTypes.func, // 关闭浮层
    switchPrev: PropTypes.func, // 切换到上一个员工, 没有上一个员工不传
    switchNext: PropTypes.func, // 切换到下一个员工, 没有下一个员工不传
  };

  static defaultProps = {
    id: undefined,
    enableEdit: false,
    open: false,
    onClose: () => {},
    switchPrev: undefined,
    switchNext: undefined,
  };

  state = {}

  componentDidMount() {
    const { id } = this.props;
    if (open) {
      this.onOpen(id);
    }
  }

  componentDidUpdate(prevProps) {
    const { open, id } = this.props;
    if (open) {
      if (prevProps.open !== open || prevProps.id !== id) {
        this.onOpen(id);
      }
    }
  }

  onOpen = id => {
    this.dispatch(OPEN_EMPLOYEE_DETAIL, id);
  };

  onChange = data => {
    this.setState({ data });
  };

  onError = formError => {
    const { error } = this.props;
    this.dispatch(UPDATE_ERROR, {
      error,
      formError,
    });
  };

  onChangeWithSession = (sessionName, id, formIdx, code, value) => {
    const { positionListMap, employeeMenus, layout } = this.props;
    const { data } = this.state;
    const formPath = [sessionName, `${id}`, formIdx];
    const fieldPath = formPath.concat(`${code}`);
    let newData = data.setIn(fieldPath, value);
    let error = immutable.fromJS({});
    if (code === 'company') {
      newData = newData.deleteIn(formPath.concat('department'));
      newData = newData.deleteIn(formPath.concat('position'));
      newData = newData.deleteIn(formPath.concat('grade'));
      newData = newData.setIn([sessionName, `${id}`, formIdx, code], value);
      newData = newData.setIn(formPath.concat('companyName'), (value.split('-') || []).slice(2).join('-'));
    }
    if (code === 'department') {
      newData = newData.deleteIn(formPath.concat('position'));
      newData = newData.deleteIn(formPath.concat('grade'));
      newData = newData.setIn([sessionName, `${id}`, formIdx, code], value);
      newData = newData.setIn(formPath.concat('departmentName'), (value.split('-') || []).slice(2).join('-'));
      this.dispatch(GET_POSITIONS_LIST, {
        id: getIdFromKey(value),
      });
    }
    if (code === 'position') {
      const positionList = positionListMap[getRealId(data.getIn(formPath.concat('department')))] || [];
      newData = newData.setIn(
        formPath.concat('grade'),
        positionList.find(item => item.id === value).gradeId
      );
      newData = newData.setIn(
        formPath.concat('positionName'),
        positionList.find(item => item.id === value).name
      );
      newData = newData.setIn(
        formPath.concat('gradeName'),
        positionList.find(item => item.id === value).gradeName
      );
    }
    if( code === 'leader' ) {
      newData = newData.setIn(
        formPath.concat('leaderName'),
        employeeMenus.find(item => item.id === value).name
      );
    }

    if( id === 'contract' ) {
      const formData = newData.getIn(formPath);

      if( code === 'period' || code === 'startDate' ) {
        const startDate = formData.get('startDate');
        const period = formData.get('period');
        if( period && startDate ) {
          if( period.indexOf('year') === 0 ) {
            newData = newData.setIn( formPath.concat('endDate'), moment(startDate).add(+period.replace('year',''), 'year').subtract(1, 'day').format('YYYY-MM-DD') );

            error = error.setIn(formPath.concat('endDate'), false);
          }
        }
      }
      if( code === 'period' && value === 'unclear' ) {
        newData = newData.setIn( formPath.concat('endDate'), moment('9999-12-31').format('YYYY-MM-DD') );
      }
      if( code === 'endDate' ) {
        newData = newData.setIn( formPath.concat('period'), 'customize' );
      }
    }

    this.onChange(newData);

    this.onError( getError( newData, fieldPath, layout, error ).toJS() );
  };

  onChangeWithHeader = (code, value, ...otherValue) => {
    const headerCodePath = ['header', code];
    const { layout } = this.props;
    const { data } = this.state;
    let newData = data.setIn(headerCodePath, value);
    if( code === 'avatar' ) {
      newData = newData.setIn(['header', 'avatarName'], otherValue[0]);
    }
    this.onChange(newData);

    this.onError( getError( newData, headerCodePath, layout ).toJS() );
  };

  onPlus = (sessionName, id) => {
    const { layout } = this.props;
    const { data } = this.state;
    const newForm = immutable.fromJS(
      getBasicDate(
        (layout[DETAIL_MAP_LAYOUT[sessionName]].find( form => `${form.id}` === `${id}` ) || {}).fields
      ) );
    let forms = data.getIn([sessionName, `${id}`]);
    if (!forms) {
      forms = immutable.fromJS([]);
    }
    this.onChange(data.setIn([sessionName, `${id}`], forms.push(newForm)));
  };

  onTrash = (sessionName, id, formIdx) => {
    const { error, layout } = this.props;
    const { data } = this.state;
    const formPath = [sessionName, `${id}`];
    const forms = data.getIn(formPath);
    const newData = data.setIn(formPath, forms.delete(formIdx));
    let newError = immutable.fromJS((error || {}).form || {});
    if( newError.getIn(formPath) ) {
      newError = newError.setIn(formPath.concat(`${formIdx}`), undefined);
    }
    this.onChange(newData);

    this.onError(
      getChangeCardNumError(
        newData,
        formPath,
        layout,
        newError,
      ).toJS()
    );
  };

  onCancel = (sessionName, id) => {
    const { prevPropsData, data } = this.state;
    const paths = [sessionName];
    if (id !== undefined) {
      paths.push(`${id}`);
    }
    this.onChange(data.setIn(paths, prevPropsData.getIn(paths)));

    this.onError(immutable.fromJS({}).setIn(paths, undefined).toJS());
  };

  onCreate = () => {
    const { layout, onSave } = this.props;
    const { data } = this.state;

    const error = this.checkForm();

    if( error ) {
      this.onError(error);
    } else {
      this.promiseDispatch(CREATE_EMPLOYEE, denormalizeData( data, layout ))
        .then(() => {
          if( onSave ) onSave();
          this.onClose();
        })
        .catch( e => {
          const serviceError = getServiceError(e, data);
          if( serviceError ) {
            this.onError(serviceError);
          }
          return e;
        });
    }
  }

  onClose = () => {
    const { onClose } = this.props;
    this.onError();
    if( onClose ) onClose();
  }

  onUpdate = (sessionName, formId) => {
    const { id, layout } = this.props;
    const { data, prevPropsData } = this.state;
    const isCustomize = !isNaN(formId);
    let type = formId;
    let path = [sessionName, `${formId}`];
    let denormalizedData;

    if( isCustomize ) {
      type = 'customize';
      denormalizedData = {
        formId,
        formData: data.getIn(path).toJS().map(({_key, ...other}) => ({
          ...other,
        })),
      };
    } else if(sessionName === 'header') {
      type = 'basic';
      const { avatar, ...other } = data.get(sessionName).toJS();
      denormalizedData = {
        ...other,
        avatar: removeDataBase64(avatar) || '0',
      }
    } else {

      denormalizedData = denormalizeStandardForms(data.getIn(path).toJS(), formId, layout, sessionName);
    }

    const error = this.checkForm();
    if( error && error[sessionName] && (!formId || error[sessionName][formId]) ) {
      return new Promise((resolve, reject) => {
        this.onError({
          [sessionName]: {
            [formId]: error[sessionName][formId],
          },
        });
        reject();
      });
    } else {
      return this.promiseDispatch(UPDATE_EMPLOYEE, {
        id,
        type: snakeCase(type),
        data: denormalizedData,
      })
      .then( () => {
        if( sessionName === 'header' ) {
          path = [sessionName];
        }
        this.dispatch(SET_EMPLOYEE_DETAIL, prevPropsData.setIn(path, data.getIn(path)));
      } )
      .catch( e => {
        const serviceError = getServiceError(e, data);
        if( serviceError ) {
          this.onError(serviceError);
        }
        return e;
      });
    }

  }

  onRefresh = () => {
    const { id } = this.props;
    this.onOpen(id);
    this.dispatch(GET_EMPLOYEE_HISTORY_INFO, id);
  }

  static getDerivedStateFromProps(props, state) {
    if (!state || props.data !== state.prevPropsData) {
      return {
        prevPropsData: props.data,
        data: props.data,
      };
    }
    return null;
  }

  promiseDispatch = createPromiseDispatch()

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;

    return fn(dispatch, { payload, meta });
  };

  checkForm(sessionName) {
    const { layout } = this.props;
    const { data } = this.state;
    const flatData = flatObj2Arr( data.toJS(), [] ).filter(({path}) => path.indexOf('_key') === -1 );

    const sessions = [].concat(sessionName || data.keySeq().toJS());

    return removeEmptyError(flatData.filter( ({path}) => ~sessions.indexOf(path[0]) )
            .reduce(
              (res, { path }) => getError( data, path, layout, res ),
              undefined,
            ).toJS());
  }


  render() {
    const { error, enableEdit, open, id, layout, companyTree, switchPrev, switchNext } = this.props;
    const { data, prevPropsData } = this.state;
    const loaded = data && layout;
    let children = <Spinner />;
    if (loaded) {
      const contentProps = {
        onCancel: this.onCancel,
        onPlus: this.onPlus,
        onTrash: this.onTrash,
        onChangeWithHeader: this.onChangeWithHeader,
        onChangeWithSession: this.onChangeWithSession,
        onUpdate: this.onUpdate,
        data,
        layout,
        companyTree,
        error: (error || {}).form,
      };

      let rightChildren = [
        <Button key='save' onClick={this.onCreate} display="block" type="primary">
          保存
        </Button>,
        <Button key='cancel' onClick={this.onClose} display="block" type="primary-light" style={{ marginTop: 10 }}>
          取消
        </Button>,
      ];

      let Employee = Entry;
      if (id) {
        Employee = Detail;
        const firstContractInfo = prevPropsData.getIn(['basicInfo', 'contract', 0]);
        const { startDate, probationEndDate } = firstContractInfo ? firstContractInfo.toJS() : {};
        const actionsProps = {
          status: prevPropsData.getIn(['basicInfo', 'job', 0, 'status']),
          hireDate: startDate,
          probationEndDate,
          id,
          onTransfer: this.onRefresh,
          onQualify: this.onRefresh,
          onResignation: this.onRefresh,
          onResignationSave: this.onRefresh,
        };
        rightChildren = [
          <StaffOperation {...actionsProps} />,
          <History {...actionsProps} />,
          <ResignationInfo {...actionsProps} />,
        ];
      }
      children = [
        <Content key='content'>
          <Employee {...contentProps} />
        </Content>,
        <SideBar key='side'>{rightChildren}</SideBar>,
      ];
		}
    return (
      <DetailDialog open={open} hasSwitch={!!id} onClose={this.onClose} switchPrev={switchPrev} switchNext={switchNext}>
        <PermissionContext.Provider value={enableEdit}>
          {children}
        </PermissionContext.Provider>
      </DetailDialog>
    );
  }
}

function getRealId( treeId = '' ) {
  return (treeId.split('-') || [])[1];
}
