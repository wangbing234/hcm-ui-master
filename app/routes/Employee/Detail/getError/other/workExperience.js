import { createDateRangeError, createDateOverlayError } from '../utils';

const start2EndError = createDateRangeError({
  start: 'startTime',
  end: 'endTime',
});

export const timeOverlayError = createDateOverlayError({
  start: 'startTime',
  end: 'endTime',
});


export default {
  startTime: [start2EndError, timeOverlayError],
  endTime: [start2EndError, timeOverlayError],
}
