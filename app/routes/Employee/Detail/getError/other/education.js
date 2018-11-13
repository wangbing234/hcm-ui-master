import { createDateRangeError, createDateOverlayError } from '../utils';

function highestError(data, path, value, error) {
  const [ sessionName, id ] = path;
  const formListPath = [sessionName, `${id}`];

  const moreHighest = data.getIn(formListPath).filter( form => form.get('highest') ).size > 1;

  return data.getIn(formListPath).reduce( (res, curr, idx) => {
    return res.setIn(formListPath.concat(idx, 'highest'), moreHighest && curr.get('highest') ? '只能有一个最高学历' : false);
  }, error );

}

const start2EndError = createDateRangeError({
  start: 'startTime',
  end: 'endTime',
});

export const timeOverlayError = createDateOverlayError({
  start: 'startTime',
  end: 'endTime',
});

export default {
  highest: highestError,
  startTime: [start2EndError, timeOverlayError],
  endTime: [start2EndError, timeOverlayError],
  onChangeCardNum: [highestError, timeOverlayError],
}
