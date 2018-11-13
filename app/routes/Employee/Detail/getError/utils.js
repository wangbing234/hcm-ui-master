import moment from 'moment';

import { timeRangeOverlaps } from 'utils/utils';

export function createDateRangeError( { start, end, tip } ) {
  return ( data, path, value, error ) => {
    const [ sessionName, id, formIdx, code] = path;
    const formPath = [sessionName, `${id}`, formIdx];

    const startDate = start === code ? value : data.getIn(formPath.concat(start));
    const endDate = end === code ? value : data.getIn(formPath.concat(end));
    if( startDate && endDate  ) {
      if( moment(endDate) < moment(startDate) ) {
        return error.setIn(formPath.concat(end), tip || '结束时间不能小于开始时间');
      } else {
        return error.setIn(formPath.concat(end), false);
      }
    }
  }
}

export function createDateOverlayError( { start, end, tip } ) {

  return ( data, path, value, error ) => {
    const [ sessionName, id, formIdx, code] = path;
    const formListPath = [sessionName, `${id}`];
    const formPath = formListPath.concat(formIdx);

    const startDate = start === code ? value : data.getIn(formPath.concat(start));
    const endDate = end === code ? value : data.getIn(formPath.concat(end));
    if( startDate && endDate  ) {
      if( moment(endDate) >= moment(startDate) ) {
        const rangeArr = data.getIn(formListPath)
          .filter( (form, idx) => idx !== formIdx && form.get(start) && form.get(end) )
          .map( form => ({
            startTime: form.get(start),
            endTime: form.get(end),
          }) )
          .toJS();

        const isOverlap = timeRangeOverlaps({
          startTime: startDate,
          endTime: endDate,
        }, rangeArr);

        return data.getIn(formListPath).reduce( (res, curr, idx) => {
          return res.setIn(formListPath.concat(idx, end), curr.get(start) && curr.get(end) && isOverlap ? tip || '时间区间不能重叠' : false);
        }, error );
      }
    }
  }

}

export function removeEmptyError(error) {
  const newError = { ...error };
  Object.keys( newError ).forEach(code => {
    let msg = newError[code];

    if( typeof msg === 'object' ) {
      msg = removeEmptyError(msg);
    }

    if (!msg) {
      delete newError[code];
    } else {
      newError[code] = msg;
    }
  });

  if (Object.keys(newError).length === 0) {
    return undefined;
  }
  return newError;
}

export function getServiceError(e, data) {
  if( e && e.meta ) {
    const { code, message, error } = e.meta || {};
    const newError = {};
    if( code === '13105' ) {
      newError.header = newError.header || {};
      newError.header.employeeNo = message;
    }
    if( code === '13111' ) {
      newError.positionInfo = newError.positionInfo || {};
      newError.positionInfo.position = newError.positionInfo.position || [];
      data.getIn(['positionInfo','position']).forEach( (item, idx) => {
        if( error && ~error.indexOf(item.get('leader')) ) {
          newError.positionInfo.position[idx] = {
            ...newError.positionInfo.position[idx],
            leader: message,
          };
        }
      } );
    }
    return newError;
  }
}
