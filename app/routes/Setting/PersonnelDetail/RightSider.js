import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Row as AntRow, Col, InputNumber } from 'antd';
import { countArray } from 'utils/utils';
import FormBox from 'components/FormBox';
import { Row } from 'layouts/FormLayout';
import { Button, Checkbox, Input, Select } from 'components/Base/';
import EmptyPlaceholder from 'components/Biz/EmptyPlaceholder';
import { ALL_FIELD_TEXT } from 'constants/field';
import styles from './RightSider.less';

const { Sider } = Layout;

const getFieldLabelByFieldType = type => {
  return ALL_FIELD_TEXT.filter(item => {
    return item.key === type;
  })[0].label;
};

class RightSider extends Component {
  static propTypes = {
    selectedField: PropTypes.object.isRequired, // 当前选中的字段对象
    onUpdateField: PropTypes.func.isRequired, // 更新字段方法
    onOptionAction: PropTypes.func.isRequired, // 选项添加或删除方法
    onOptionUpdate: PropTypes.func.isRequired, // 选项更新方法
  };

  state = {
    maxOption: 20, // 控件选项数目
  };

  // 通用 change 方法
  onChange = (code, value) => {
    const { onUpdateField } = this.props;
    onUpdateField(code, value);
  };

  // 选项值更新
  onOptionChange = (value, index) => {
    const { onOptionUpdate } = this.props;
    onOptionUpdate('options', value, index);
  };

  // 添加删除选项动作
  onOptionAction = index => {
    const { onOptionAction } = this.props;
    onOptionAction(index);
  };

  render() {
    const { maxOption } = this.state;
    const { selectedField } = this.props;

    const fieldType = selectedField.get('fieldType');
    const attrbuite = selectedField.get('attribute');
    const label = fieldType && getFieldLabelByFieldType(fieldType);

    // wrapper
    const withFormBox = (children, props) => {
      const { code, title, required = false } = props;
      if (attrbuite.has(code)) {
        return (
          <FormBox
            className={styles.formbox}
            label={title}
            isRequired={required}
            errorMsg={required && !attrbuite.get(code) ? `${title}不能为空` : ''}
          >
            {children}
          </FormBox>
        );
      } else {
        return null;
      }
    };

    // 输入框
    const renderInput = props => {
      const { code } = props;
      return withFormBox(
        <Input
          placeholder="请填写"
          value={attrbuite.get(code)}
          onChange={e => {
            this.onChange(code, e.target.value);
          }}
        />,
        props
      );
    };

    // 复选框
    const renderCheckbox = props => {
      const { code, title } = props;
      return (
        <Checkbox
          className={styles.checkbox}
          checked={attrbuite.get(code)}
          onChange={e => {
            this.onChange(code, e.target.checked);
          }}
        >
          {title}
        </Checkbox>
      );
    };

    // 数字
    const renderNumber = props => {
      const { code } = props;
      return withFormBox(
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={0}
          value={attrbuite.get(code)}
          onChange={value => {
            this.onChange(code, value);
          }}
        />,
        props
      );
    };

    // 下拉框
    const renderSelect = props => {
      const { code, options } = props;
      return withFormBox(
        <Select
          style={{ width: '100%' }}
          placeholder="请选择"
          value={attrbuite.get(code)}
          onChange={value => {
            this.onChange(code, value);
          }}
        >
          {options.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>,
        props
      );
    };

    // 数字范围
    const renderNumberRange = props => {
      return withFormBox(
        <AntRow type="flex" justify="space-around" align="middle">
          <Col span={11}>
            <InputNumber
              style={{ width: '100%' }}
              precision={0}
              value={attrbuite.get('min')}
              onChange={value => {
                this.onChange('min', value);
              }}
            />
          </Col>
          <Col span={2} style={{ textAlign: 'center' }}>
            -
          </Col>
          <Col span={11}>
            <InputNumber
              style={{ width: '100%' }}
              precision={0}
              value={attrbuite.get('max')}
              onChange={value => {
                this.onChange('max', value);
              }}
            />
          </Col>
        </AntRow>,
        props
      );
    };

    return (
      <Sider className={styles.main} theme="light" width={300}>
        {selectedField && selectedField.size && attrbuite ? (
          <div>
            <header className={styles.commonInfo}>
              <h1 className={styles.title}>{label}</h1>
              {/* 是否必填 */}
              {renderCheckbox({
                code: 'required',
                title: '是否必填',
              })}

              {/* 标题 */}
              {renderInput({
                code: 'label',
                title: '标题',
                required: true,
              })}

              {/* 长度限制 */}
              {renderNumber({
                code: 'length',
                title: '控件文本长度限制',
              })}

              {/* 预置文案 */}
              {renderInput({
                code: 'placeholder',
                title: '预置文案',
              })}

              {/* 数字输入框-数值范围 */}
              {renderNumberRange({
                code: 'min',
                title: '数值范围',
              })}

              {/* 小数位数 */}
              {renderSelect({
                code: 'decimal',
                title: '小数位数',
                options: [
                  { label: 0, value: 0 },
                  { label: 1, value: 1 },
                  { label: 2, value: 2 },
                  { label: 3, value: 3 },
                ],
              })}

              {/* 数字输入框-默认值 */}
              {renderNumber({
                code: 'defaultValue',
                title: '默认数值',
              })}

              {/* 日期格式设置 */}
              {renderSelect({
                code: 'format',
                title: '格式设置',
                required: true,
                options: [
                  { label: '日期', value: 'date' },
                  { label: '日期+时间', value: 'datetime' },
                ],
              })}
            </header>
            {attrbuite.has('options') && (
              <div className={styles.optionInfo}>
                <h2 className={styles.subtitle}>选项设置 *</h2>
                <p className={styles.desc}>
                  选项文案由一段文字组成，可添加多个选项（最多{maxOption}个）
                </p>
                {attrbuite.get('options').map((item, index, self) => {
                  const key = index;
                  let errorMsg = '';
                  if (!item) {
                    errorMsg = '选项值不能为空';
                  }
                  if (countArray(self.toJS(), item) > 1) {
                    errorMsg = `选项值 [${item}] 有重复`;
                  }

                  return (
                    <FormBox key={key} className={styles.optionFormbox} errorMsg={errorMsg}>
                      <Row className={styles.optionRow}>
                        <Input
                          value={item}
                          onChange={e => {
                            this.onOptionChange(e.target.value, index);
                          }}
                        />
                        {index < 1 ? null : (
                          <Button
                            className={styles.optionBtn}
                            icon="delete"
                            onClick={() => {
                              this.onOptionAction(index);
                            }}
                          />
                        )}
                      </Row>
                    </FormBox>
                  );
                })}
                {/* 最大添加20个选项 */}
                {attrbuite.get('options').size < maxOption && (
                  <Button
                    type="primary-light"
                    display="block"
                    onClick={() => {
                      this.onOptionAction();
                    }}
                  >
                    + 添加选项
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.empty}>
            <EmptyPlaceholder size={97} placeholder="请选择表单控件" />
          </div>
        )}
      </Sider>
    );
  }
}

export default RightSider;
