import Ajv from 'ajv';
import { isEmpty } from 'lodash';
import * as Schemas from '../shcema';

const ajvFactory = (function ajvFactory() {
  let ajv;

  function getInstance() {
    if (isEmpty(ajv)) {
      ajv = new Ajv({
        allErrors: true,
        removeAdditional: true,
      });
    }
    return ajv;
  }

  return {
    getInstance,
  };
})();

function initValidate(schemas) {
  return Object.keys(schemas).reduce((instance, schemaName) => {
    const SCHEMA = schemas[schemaName];
    const SCHEMA_NAME = schemas[schemaName].name;
    // 防止多次执行 重复 addSchema 报错
    // eslint-disable-next-line
    if (Object.keys(instance._schemas).indexOf(SCHEMA_NAME) !== -1) {
      instance.removeSchema(SCHEMA_NAME);
    }
    return instance.addSchema(SCHEMA, SCHEMA_NAME);
  }, ajvFactory.getInstance());
}

function printError(err) {
  if (err && window.console) {
    window.console.error('model check error: ', err);
  }
}

export function checkModel(schema, data) {
  const validate = initValidate(Schemas).compile(schema);
  const valid = validate(data);
  if (!valid) printError(validate.errors);
  return !valid;
}
