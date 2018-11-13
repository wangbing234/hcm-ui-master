import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Column from './Column';
import styles from './Layout.less';

export default class Row extends Component {
  static dispalyName = 'FormRow';

  static propTypes = {
    cols: PropTypes.number,
    className: PropTypes.string,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    cols: 2,
    className: '',
    visible: true,
  };

  render() {
    const { cols, className, visible } = this.props;
    let { children } = this.props;
    const childrenCount = Children.count(children);
    if (cols > childrenCount) {
      children = [].concat(
        children,
        new Array(cols - childrenCount)
          .fill('')
          .map((val, i) => i)
          .map(val => <Column key={val} />)
      );
    }
    if (childrenCount > 1) {
      children = Array.from(children).slice(0, cols);
    }
    return (
      <div
        className={classNames(`${styles.row} hcm-row`, {
          [styles.hidden]: !visible,
          [className]: className,
        })}
      >
        {children}
      </div>
    );
  }
}
