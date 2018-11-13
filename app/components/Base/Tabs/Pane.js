/* eslint-disable */

import React, { PureComponent } from "react";
import PropTypes from 'prop-types';

class Pane extends PureComponent {

	static propTypes = {
		id: PropTypes.string.isRequired, // tab id
		title: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node.isRequired]),  // 标题
  };

  render() {
    return this.props.children;
  }
}

export default Pane;
