import React, { Component } from 'react';
import { Button } from 'components/Base';

export default class ActionButton extends Component {

  state = {
    loading: false,
  };

  // 处理异步
  handleClick = () => {
    const { action, close } = this.props;
    if (action) {
      let ret;
      if (action.length) {
        ret = action(close);
      } else {
        ret = action();
        if (!ret) {
          close();
        }
      }
      if (ret && ret.then) {
        this.setState({ loading: true });
        ret.then((...args) => {
          close(...args);
        }, () => {
          this.setState({ loading: false });
        });
      }
    } else {
      close();
    }
  }

  render() {
    const { loading } = this.state;
    const { type, children } = this.props;
    return (
      <Button type={type} onClick={this.handleClick} loading={loading}>
        {children}
      </Button>
    );
  }
}
