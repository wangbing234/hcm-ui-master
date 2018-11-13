import React, { Component } from 'react';
import classnames from 'classnames';

import styles from './Card.less';

export default class Card extends Component {
  render() {
    const { className, children } = this.props;
    return <div className={classnames(styles.card, { [className]: className })}>{children}</div>;
  }
}
