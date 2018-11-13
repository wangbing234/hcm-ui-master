import { checkId } from 'utils/utils';

function employeeNoError(data, path, value, error) {
  return error.setIn( path, checkId(value) ? false : '请输入小于8位字母或数字' );
}

export default {
  employeeNo: employeeNoError,
}
