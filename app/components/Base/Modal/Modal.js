import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Modal } from 'antd';

import styles from './Modal.less';

const LARGE_WIDTH = 840;
const MIDDLE_WIDTH = 640;
const SMALL_WIDTH = 600;

export default class HCMModal extends PureComponent {
  static propTypes = {
    middle: PropTypes.bool,
    small: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    middle: false,
    small: false,
    className: '',
  };

  render() {
    const { className, middle, small } = this.props;

    let width = LARGE_WIDTH;
    if (middle) {
      width = MIDDLE_WIDTH;
    } else if (small) {
      width = SMALL_WIDTH;
    }

    return (
      <Modal
        wrapClassName={classnames(styles.wrap, { [className]: className })}
        width={width}
        maskClosable={false}
        {...this.props}
      />
    );
  }
}
