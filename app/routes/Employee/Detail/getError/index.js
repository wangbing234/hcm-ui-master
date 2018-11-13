import immutable from 'immutable';

import { SESSION_KEY, DETAIL_MAP_LAYOUT } from 'constants/employee';

import { getFieldError } from 'components/Biz/ConfigableField/ConfigableField';

import header from './header';
import position from './position';
import basic from './basic';
import other from './other';

const { HEADER, POSITION_INFO, BASIC_INFO, OTHER_INFO } = SESSION_KEY;

const errorRule = {
  [HEADER]: header,
  [POSITION_INFO]: position,
  [BASIC_INFO]: basic,
  [OTHER_INFO]: other,
};

function getStrandError(data, path, value, error) {
  const [ sessionName, id, formIdx, code] = path;
  if( errorRule[sessionName] && errorRule[sessionName][id] ) {
    let rules = errorRule[sessionName][id];
    if( sessionName !== HEADER ) {
      rules = rules[code];
    }
    if( formIdx === -1 ) {
      throw new Error('no error');
    }
    if(rules) {
      return [].concat(rules).reduce( (res, rule) => rule(data, path, value, res) || res, error );
    }
  }
  return error;
}

function getConfigFromLayout(layout, [sessionName, id, formIdx, code], isCreate) {
  if( sessionName === 'header' && !formIdx ) {
    const config = immutable.fromJS(layout).getIn([sessionName, id]);
    if( config ) {
      return config.toJS();
    }
    return config;
  } else {
    if( isCreate && layout[DETAIL_MAP_LAYOUT[sessionName]].isBoard ) {
      return undefined;
    }
    return ((layout[DETAIL_MAP_LAYOUT[sessionName]]
              .filter( ({onBoard}) => !isCreate || onBoard)
              .find( form => `${form.id}` === `${id}` ) || {}).fields || [])
                .find( field => `${(field.code || field.fieldId)}` === `${code}` )
  }
}

export function getChangeCardNumError( data, path, layout, error = immutable.fromJS({}) ) {
  return data.getIn(path).reduce(
    ( res, current, idx ) => getStrandError(data, path.concat(idx, 'onChangeCardNum'), undefined, res),
    error,
  );
}

export default function getError(data, path, layout, error = immutable.fromJS({})) {
  const isCreate = !data.getIn(['header', 'id']);
  const value = data.getIn(path);
  const config = getConfigFromLayout(layout, path, !isCreate) || {};

  const newError = getStrandError(data, path, value, error);
  if( newError && newError.getIn(path) ) {
    return newError;
  }
  return newError.setIn(path, getFieldError(value, config));
}
