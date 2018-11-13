import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from 'antd';
import styles from './FormItem.less';

const AntdFormItem = Form.Item;

class FormItem extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    required: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    required: false,
  };

  render() {
    const { label, required, ...props } = this.props;
    return (
      <div>
        <span className={classNames(styles.label, { [styles.required]: required })}>
          <span>{label}</span>
        </span>
        <AntdFormItem {...props} />
      </div>
    );
  }
}

export default FormItem;
