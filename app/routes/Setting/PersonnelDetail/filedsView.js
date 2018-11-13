import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, DatePicker } from 'antd';
import { uid } from 'utils/utils';
import { FIELD_EMNU } from 'constants/field';
import FormBox from 'components/FormBox';
import { Button, Input, Select, Checkbox, Radio } from 'components/Base/';
import styles from './filedsView.less';

class FieldTpl extends PureComponent {
  static propTypes = {
    field: PropTypes.object.isRequired, // 单个字段
    usefor: PropTypes.oneOf(['drag', 'preview']).isRequired, //  用途
  };

  render() {
    const { field, usefor } = this.props;
    const fieldType = field.get('fieldType');
    const attribute = field.get('attribute');

    // frombox 容器
    const withFormBox = children => {
      return (
        <FormBox label={attribute.get('label')} isRequired={attribute.get('required')}>
          {children}
        </FormBox>
      );
    };

    switch (fieldType) {
      // 单行文本
      case FIELD_EMNU.TEXT:
        return withFormBox(<Input placeholder={attribute.get('placeholder')} />);

      // 多行文本
      case FIELD_EMNU.TEXTAREA:
        return withFormBox(<Input.TextArea placeholder={attribute.get('placeholder')} />);

      // 下拉框单选
      case FIELD_EMNU.SELECT:
        return withFormBox(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {attribute.get('options').map(option => (
              <Select.Option key={uid()} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );

      // 下拉框多选
      case FIELD_EMNU.MULTI_SELECT:
        return withFormBox(
          <Select
            placeholder="请选择"
            mode={usefor === 'drag' ? false : 'multiple'}
            style={{ width: '100%' }}
          >
            {attribute.get('options').map(option => (
              <Select.Option key={uid()} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        );

      // 数字
      case FIELD_EMNU.DECIMAL:
        return withFormBox(
          <InputNumber
            className={styles.inputNumber}
            style={{ width: '100%' }}
            min={attribute.get('min')}
            max={attribute.get('max')}
            defaultValue={attribute.get('defaultValue')}
            precision={attribute.get('decimal')}
          />
        );

      // 单选框
      case FIELD_EMNU.RADIO:
        return withFormBox(
          <Radio.Group className={styles.radio}>
            {attribute.get('options').map(option => (
              <Radio key={uid()} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );

      // 多选框
      case FIELD_EMNU.CHECKBOX:
        return withFormBox(
          <div>
            {attribute.get('options').map(option => (
              <Checkbox key={uid()} className={styles.checkbox} value={option}>
                {option}
              </Checkbox>
            ))}
          </div>
        );

      // 日期区间
      case FIELD_EMNU.DATE_RANGE:
        return withFormBox(<DatePicker.RangePicker style={{ width: '100%' }} />);

      // 日期
      case FIELD_EMNU.DATE:
        return withFormBox(<DatePicker style={{ width: '100%' }} />);

      // 附件
      case FIELD_EMNU.FILE:
        return withFormBox(
          <Button display="block" className={styles.uploadBtn}>
            + 添加附件
          </Button>
        );
      default:
        return null;
    }
  }
}

export default FieldTpl;
