import { isIdentity } from 'utils/utils';

function identityError(data, path, value, error) {
  const [ sessionName, id, formIdx ] = path;
  const formPath = [sessionName, `${id}`, formIdx];

  if( data.getIn(formPath.concat('type')) === 'identity' && !isIdentity(value) ) {
    return error.setIn(path, '请输入正确的身份证号');
  } else {
    return error.setIn(path, false);
  }
}

export default {
  code: identityError,
}
