import React, { Component } from 'react';
import Row from './Row';
import Column from './Column';

export default class FullRow extends Component {
  static dispalyName = 'FromRow';

  render() {
    const { children, visible, className  } = this.props;
    return (
      <Row className={className} cols={1} visible={visible}>
        <Column>{children}</Column>
      </Row>
    );
  }
}
