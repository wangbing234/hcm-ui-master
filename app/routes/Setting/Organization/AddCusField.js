import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TARGET_TYPE_ITEMS as TARGET_TYPE, FIELD_TYPE_ITEMS as FIELD_TYPE } from 'constants/field';
import { ViewStatus } from 'constants/view';
import { Layout, Row, Column, FullRow } from 'layouts/FormLayout';
import { Select, Input, Button, Modal } from 'components/Base';
import FormBox from 'components/FormBox';
import styles from './CusOrgField.less';


class AddCusField extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    status: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onAddOption: PropTypes.func.isRequired,
    onDeleteOption: PropTypes.func.isRequired,
  };

  render() {
    const {
      visible,
      onOk,
      onCancel,
      onChange,
      data,
      errors,
      onAddOption,
      onDeleteOption,
      status,
    } = this.props;
    const disabled = status === ViewStatus.EDIT;

    return (
      <Modal
        title={status === ViewStatus.ADD ? '新建自定义字段' : '编辑自定义字段'}
        maskClosable={false}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Layout>
          <Row>
            <Column>
              <FormBox label="序号" isRequired errorMsg={errors.get('idx')}>
                <Input
                  value={data.get('idx') ? data.get('idx') : ''}
                  error={!!errors.get('idx')}
                  onChange={e => onChange('idx', e.target.value)}
                />
              </FormBox>
            </Column>
            <Column>
              <FormBox label="字段编码" isRequired errorMsg={errors.get('code')}>
                <Input
                  disabled={disabled}
                  value={data.get('code')}
                  error={!!errors.get('code')}
                  onChange={e => onChange('code', e.target.value)}
                />
              </FormBox>
            </Column>
          </Row>
          <Row>
            <Column>
              <FormBox label="字段名称" isRequired errorMsg={errors.get('label')}>
                <Input
                  value={data.get('label')}
                  error={!!errors.get('label')}
                  onChange={e => onChange('label', e.target.value)}
                />
              </FormBox>
            </Column>
            <Column>
              <FormBox label="所属" isRequired errorMsg={errors.get('targetType')}>
                <Select
                  transparent
                  defaultValue=""
                  value={data.get('targetType')}
                  error={!!errors.get('targetType')}
                  onChange={val => onChange('targetType', val)}
                >
                  {TARGET_TYPE.map(type => (
                    <Select.Option key={type.key} value={type.key}>
                      {type.label}
                    </Select.Option>
                  ))}
                </Select>
              </FormBox>
            </Column>
          </Row>
          <Row>
            <Column>
              <FormBox label="是否必填" isRequired errorMsg={errors.get('required')}>
                <Select
                  transparent
                  defaultValue=""
                  error={!!errors.get('required')}
                  value={data.get('required') === undefined ? '' : data.get('required') ? 0 : 1}
                  onChange={val => onChange('required', val === 0)}
                >
                  <Select.Option value={0}>必填</Select.Option>
                  <Select.Option value={1}>选填</Select.Option>
                </Select>
              </FormBox>
            </Column>
            <Column>
              <FormBox label="字段类型" isRequired errorMsg={errors.get('fieldType')}>
                <Select
                  transparent
                  defaultValue=""
                  disabled={disabled}
                  value={data.get('fieldType')}
                  error={!!errors.get('fieldType')}
                  onChange={val => onChange('fieldType', val)}
                >
                  {FIELD_TYPE.map(type => (
                    <Select.Option key={type.key} value={type.key}>
                      {type.label}
                    </Select.Option>
                  ))}
                </Select>
              </FormBox>
            </Column>
          </Row>
          <Row visible={data.get('fieldType') === 'textField'}>
            <Column>
              <FormBox label="字段提示文案" isRequired errorMsg={errors.get('placeholder')}>
                <Input
                  value={data.get('placeholder')}
                  error={!!errors.get('placeholder')}
                  onChange={e => onChange('placeholder', e.target.value)}
                />
              </FormBox>
            </Column>
            <Column>
              <FormBox label="字段长度" isRequired errorMsg={errors.get('length')}>
                <Input
                  error={!!errors.get('length')}
                  value={data.get('length')}
                  onChange={e => onChange('length', e.target.value)}
                />
              </FormBox>
            </Column>
          </Row>
          <FullRow visible={data.get('fieldType') === 'select'}>
            <div style={{ display: 'flex', flex: 1 }}>
              <div className={styles.selectItemsHeader}>选项</div>
              <div className={styles.selectItemsWrapper}>
                {data && data.get('options')
                  ? data.get('options').map((item, index) => {
                      const key = index;
                      return (
                        <FormBox key={key} className={styles.optionFormbox} isRequired errorMsg={errors.getIn(['options', key])}>
                          <Row className={styles.optionRow}>
                            <Input
                              value={item}
                              error={!!errors.getIn(['options', index])}
                              onChange={e => onChange('options', e.target.value, index)}
                            />
                            {index === 0 ? null : (
                              <Button
                                icon="delete"
                                onClick={() => onDeleteOption(index)}
                                className={styles.deleteOption}
                              />
                            )}
                          </Row>
                        </FormBox>
                      );
                    })
                  : null}
                <Row>
                  <Button
                    icon="plus"
                    onClick={() => onAddOption()}
                    className={classNames(styles.addOption, {
                      'ant-btn-block': true,
                      'ant-btn-primary-light': true,
                    })}
                  >
                    添加选项
                  </Button>
                </Row>
              </div>
            </div>
          </FullRow>
        </Layout>
      </Modal>
    );
  }
}

export default AddCusField;
