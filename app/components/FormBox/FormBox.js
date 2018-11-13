import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './FormBox.less';

class FormBox extends Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    errorMsg: PropTypes.string,
    isRequired: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    errorMsg: '',
    isRequired: false,
  };

  render() {
    const { label, errorMsg, isRequired, children, className } = this.props;
    return (
      <div className={className}>
        { label &&
          (
            <label className={classNames(styles.label, { [styles.isRequired]: !!isRequired })}>
              {label}
            </label>
          )
        }
        {children}
        { errorMsg &&
          (
            <span className={classNames(styles.errorMessage)}>
              <span>{errorMsg}</span>
            </span>
          )
        }
      </div>
    );
  }
}

export default FormBox;
