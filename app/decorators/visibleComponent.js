import React, { Component } from 'react';
import PropTypes from 'prop-types';

const visibleComponent = WrappedComponent => {
  return class extends Component {
    static propTypes = {
      visible: PropTypes.bool,
    };

    static defaultProps = {
      visible: false,
    };

    render() {
      const { visible } = this.props;
      return visible ? <WrappedComponent {...this.props} /> : null;
    }
  };
};
export default visibleComponent;
