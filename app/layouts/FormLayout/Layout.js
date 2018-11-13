import React, { PureComponent } from 'react';

import styles from './Layout.less';

export function withClassDiv(className, dispalyName) {
  class EnhanceDiv extends PureComponent {
    static dispalyName = dispalyName;

    render() {
      const { children } = this.props;
      return <div className={className}>{children}</div>;
    }
  }
  return EnhanceDiv;
}

export default withClassDiv(`${styles.layout} hcm-layout`, 'FormLayout');
