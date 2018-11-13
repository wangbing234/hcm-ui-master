import { createDateRangeError, createDateOverlayError } from '../utils';

const start2EndError = createDateRangeError({
  start: 'startDate',
  end: 'endDate',
});
const start2ProbationError = createDateRangeError({
  start: 'startDate',
  end: 'probationEndDate',
  tip: '试用期结束日期不能小于开始日期',
});

export const dateOverlayError = createDateOverlayError({
  start: 'startDate',
  end: 'endDate',
});

export default {
  startDate: [start2EndError, start2ProbationError, dateOverlayError],
  endDate: [start2EndError, dateOverlayError],
  probationEndDate: start2ProbationError,
  period: [start2ProbationError, dateOverlayError],
  onChangeCardNum: dateOverlayError,
}
