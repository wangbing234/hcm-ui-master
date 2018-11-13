import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker, InputNumber, Radio } from 'antd';
import { strTemplate, isNumeric, checkRequire, checkLength, checkDecimal, isMobile } from 'utils/utils';
import { inRange } from 'lodash/number';
import { FIELD_EMNU } from 'constants/field';
import Upload from 'components/Upload'
import { Input, Select,Checkbox } from 'components/Base';

const CHECK_AND_TIP = {
  required: {
    check: checkRequire,
    tip: '不能为空',
  },
  length: {
    check: checkLength,
    tip: '长度不能大于{1}个字符',
  },
  number: {
    check: isNumeric,
    tip: '请输入数字',
  },
  decimal: {
    check: checkDecimal,
    tip: '数字必须是{1}位小数',
  },
  range: {
    check: inRange,
    tip: '数字必须在{1}至{2}之间',
  },
  mobile: {
    check: isMobile,
    tip: '请输入11位有效数字',
  },
}

function getTip( { check, tip }, ...args ) {
  if( check( ...args ) ) {
    return false;
  }
  return strTemplate(tip, ...args);
}

export function getFieldError( value, { required, length, fieldType, min, max, decimal, mobile} ) {
  let error = false;
  if( required ) {
    error = getTip(CHECK_AND_TIP.required, value);
    if( error ) {
      return error;
    }
  }

  if( length ) {
    error = getTip(CHECK_AND_TIP.length, value, length);
    if( error ) {
      return error;
    }
  }

  switch( fieldType ) {
    case FIELD_EMNU.DECIMAL:
      if( !CHECK_AND_TIP.number.check( value ) ) {
        error = CHECK_AND_TIP.number.tip;
        if( error ) {
          return error;
        }
      }
      break;
    default:
  }

  if( isNumeric(decimal) ) {
    error = getTip(CHECK_AND_TIP.decimal, value, decimal);
    if( error ) {
      return error;
    }
  }

  if( isNumeric(min) && isNumeric(max) ) {
    error = getTip(CHECK_AND_TIP.range, value, min, max);
    if( error ) {
      return error;
    }
  }

  if( mobile ) {
    error = getTip(CHECK_AND_TIP.mobile, value, min, max);
    if( error ) {
      return error;
    }
  }

  return false;

}

export class ConfigableField extends PureComponent {
  static propTypes = {
    fieldType: PropTypes.any,
    options: PropTypes.array,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    fieldType: FIELD_EMNU.TEXT,
    placeholder: '',
    options: [],
    value: '',
    onChange: () => {},
  };

  onChange = value => {
    const { fieldId, code, onChange } = this.props;
    const key = code || fieldId;
    onChange(key, value);
  };

  // 文件上传
  onUploadChange = (data) =>{
    this.onChange(data);
  }

  // 文本框输入
  onInputChange = e => {
    this.onChange(e.target.value);
  };

  // 日期选择
  onDateChange = (date, dateString) => {
    this.onChange(dateString);
  };

  render() {
    const { fieldType, placeholder, options, value } = this.props;

    switch (fieldType) {
      case FIELD_EMNU.SELECT:
        return (
          <Select
            style={{ width: '100%' }}
            value={value === '' ? undefined : value}
            onChange={this.onChange}
            placeholder={placeholder || '请选择'}
          >
            {options.map(option => {
              const { label } = option;
              const isObj = typeof option === 'object';
              return (
                <Select.Option value={isObj ? option.value : option}>
                  {isObj ? label : option}
                </Select.Option>
              );
            })}
          </Select>
        );
        case FIELD_EMNU.MULTI_SELECT:
          return(
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={value === '' ? undefined : value}
              onChange={this.onChange}
              placeholder={placeholder}
            >
              {options.map(option => (
                <Select.Option key={option}>
                  {option}
                </Select.Option>

              // }
              ))}
            </Select>
          )
        case FIELD_EMNU.TEXTAREA:
          return (<Input.TextArea value={value} placeholder={placeholder} onChange={this.onInputChange} style={{height:36}} />);
        case FIELD_EMNU.DECIMAL:
            return (
              <InputNumber
                style={{ width: '100%' }}
                value={value}
                placeholder={placeholder}
                onChange={this.onChange}
              />
        )
        case FIELD_EMNU.RADIO:
          return(
            <Radio.Group value={value} onChange={this.onInputChange}>
              {options.map(option => (
                <Radio value={option}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          )
        case FIELD_EMNU.CHECKBOX:
          return (
            <div>
              <Checkbox.Group
                options={options}
                value={value}
                onChange={this.onChange}
              />
            </div>
          );
        case FIELD_EMNU.DATE_RANGE:
          return (<DatePicker.RangePicker value={(value || ['', '']).map(str => str ? moment(str) : undefined ) } style={{ width: '100%' }} onChange={this.onDateChange}/>);
        case FIELD_EMNU.FILE:
          return (
            <Upload defautValue={value || {}} onChange={this.onUploadChange} />
          );
        case FIELD_EMNU.DATE:
          return (
            <DatePicker
              value={value ? moment(value) : undefined}
              placeholder={placeholder}
              style={{ width: '100%' }}
              onChange={this.onDateChange}
            />

          );
      default:
        return <Input placeholder={placeholder} value={value} onChange={this.onInputChange} />;
    }
  }
}

export default function configableFieldStrategy(exceptions, onChange) {
  return (data, config) => {
    const { fieldId, code } = config;
    const key = code || fieldId;
    const exception = exceptions[key];
    let value = data[key];
    if (value === undefined) {
      value = data.customField ? data.customField[key] : undefined;
    }
    if (exception && typeof exception === 'function') {
      const exceptionField = exception(value, config, onChange);
      if( exceptionField ) {
        return exceptionField;
      }
    }
    return <ConfigableField key={key} onChange={onChange} {...config} value={value} />;
  };
}
