import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FIELD_EMNU } from 'constants/field';
import { Layout, SplitRow, FullRow } from 'layouts/FormLayout';
import FormBox from 'components/FormBox';
import UploadView from 'components/Upload/UploadView';
import styles from './Layout.less'

function ViewBox(props) {
  const { label, ...rest} = props;
  return (
    <div>
      <div className={styles.label}>{label}</div>
      {renderViewByFieldType(rest)}
    </div>
  )
}

// 根据字段类型渲染表单查看的视图
function renderViewByFieldType({ fieldType, value:_value }) {
  let value = _value;
  if (value) {
    switch(fieldType) {
      case FIELD_EMNU.FILE:
        return <UploadView data={value} />;

      default:
        value = (typeof value === 'object') ? '-' : value; // 脏数据容错
        return <div className={styles.field}>{value}</div>;
    }
  } else {
    return <div className={styles.field}>-</div>;
  }
}

export default class FieldLayout extends PureComponent {
  static propTypes = {
    // 字段配置信息
    formField: PropTypes.array,
    // 错误信息, 对象结构, key为字段code，value为错误信息
    error: PropTypes.any,
    // api返回的entry信息
    data: PropTypes.any,
    // 例外字段, 对象结构, key为字段code，value为函数，返回Element :: ( data, config, onChange ) -> Element
    // exceptions: PropTypes.object,
    // 字段改变触发函数 :: ( code, value ) -> any
    // onChange: PropTypes.func,
  };

  static defaultProps = {
    formField: [],
    error: undefined,
    data: undefined,
  };

  render() {
    const {
      isView,
      data,
      error,
      formField,
      createFieldElement,
      getFieldValue,
    } = this.props;

    const rows = [];
    let columns = [];
    formField.forEach(config => {
      const key = `${rows.length}_${columns.length}`;
      const element = isView ? (
        <ViewBox
          key={key}
          label={config.label}
          fieldType={config.fieldType}
          value={getFieldValue(data, config)}
        />
      ) : (
        <FormBox
          key={key}
          errorMsg={error && error[config.code || config.fieldId]}
          label={config.label}
          isRequired={config.required}
        >
          {createFieldElement(data, config)}
        </FormBox>
      );

      if (config.fieldType === FIELD_EMNU.TEXT_AREA) {
        if (columns.length) {
          rows.push(<SplitRow key={rows.length}>{columns}</SplitRow>);
          columns = [];
        }
        rows.push(<FullRow key={rows.length}>{element}</FullRow>);
      } else {
        columns.push(element);
        if (columns.length === 2) {
          rows.push(<SplitRow key={rows.length}>{columns}</SplitRow>);
          columns = [];
        }
      }
    });
    if (columns.length) {
      rows.push(<SplitRow key={rows.length}>{columns}</SplitRow>);
      columns = [];
    }
    return <Layout>{rows}</Layout>;
  }
}

export function fieldValueStrategy(exceptions) {
  return (data, config) => {
    const { fieldType, code, fieldId, options } = config;
    const key = code || fieldId;
    const exception = exceptions[key];
    if (exception && typeof exception === 'function') {
      return exception(data, config);
    }

    const showValue = data[key];
    switch (fieldType) {
      case FIELD_EMNU.SELECT:
        if (options && options.length) {
          return (
            options
              .map(
                option =>
                  typeof option === 'object'
                    ? option
                    : {
                        value: option,
                        label: option,
                      },
              )
              .find(({ value }) => value === showValue) || {}
          ).label;
        }
        break;

      case FIELD_EMNU.DATE_RANGE:
        return showValue ? showValue.join(' - ') : '-';
      case FIELD_EMNU.CHECKBOX:
      case FIELD_EMNU.MULTI_SELECT:
        if (options && options.length && showValue) {
          return options.filter((option, index) => option === showValue[index]).join(', ');
        }
        break;

      default:
        return showValue;
    }
  };
}
