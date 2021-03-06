import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { actions } from 'models/position';

import Position from './Position';

const { GET_POSITIONS, UPDATE_POSITION_INFO } = actions;

const DEFAULT_STATE = {
  active: '1',
  keyword: '',
  pageNo: 1,
  pageSize: 20,
};

@connect(({ position }) => ({
  positionInfo: position.positionInfo,
}))
export default class PositionContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    this.getApiPageConfig = () => {
      return this.state;
    };

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;

      return fn(dispatch, { payload, meta });
    };

    this.extraProps = {
      onRefresh: () => this.dispatch(GET_POSITIONS, this.getApiPageConfig()),
      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
        this.setState({
          pageNo: newPageNo || pageNo,
          pageSize: newPageSize || pageSize,
        });
      },

      changeState: name => val => this.setState({ [name]: val }),

      updateInfoPosition: payload => this.dispatch(UPDATE_POSITION_INFO, payload),
    };
  }

  render() {
    return <Position {...this.props} {...this.extraProps} payload={this.state} />;
  }
}
