import React, { Component, Children } from 'react';

import Row from './Row';
import Column from './Column';

export default class SplitRow extends Component {
  static dispalyName = 'SplitRow';

  render() {
    const { children } = this.props;
    let cols = Children.count(children);
    if (cols < 2) {
      cols = 2;
    }
    return <Row cols={cols}>{Children.map(children, child => <Column>{child}</Column>)}</Row>;
  }
}
