import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import { FullScreenDialog } from 'components/FullScreenDialog';

import styles from './Detail.less';

export default class DetailDialog extends PureComponent {

  static propTypes = {
    hasSwitch: PropTypes.bool, // 是否展示切换按钮
    open: PropTypes.bool, // 是否展示浮层
    onClose: PropTypes.func, // 关闭浮层
    switchPrev: PropTypes.func, // 切换到上一个员工, 没有上一个员工不传
    switchNext: PropTypes.func, // 切换到下一个员工, 没有下一个员工不传
  };

  static defaultProps = {
    hasSwitch: false,
    open: false,
    onClose: () => {},
    switchPrev: undefined,
    switchNext: undefined,
  };

  render() {
    const { open, hasSwitch, switchPrev, switchNext, onClose, children } = this.props;
    return (
      <FullScreenDialog
        visible={open}
        width={1040}
        onClose={onClose}
        tools={
          hasSwitch ? [
            <div
              onClick={switchPrev}
              className={classnames(`${styles.switchBtn} icon-up`, {
                [styles.switchDisabled]: !switchPrev,
              })}
            />,
            <div
              onClick={switchNext}
              className={classnames(`${styles.switchBtn} icon-down`, {
                [styles.switchDisabled]: !switchNext,
              })}
            />,
          ]: []
        }
      >
        {children}
      </FullScreenDialog>
    );
  }
}
