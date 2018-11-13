import React, { Component } from 'react';
import { connect } from 'dva';
import { actions } from 'models/getEmployees';
import OnBoardStadds from './OnBoardStaffs';

const { GET_ON_BOARD_STAFFS_LIST_FORMAL, GET_ON_BOARD_STAFFS_LIST_PROBATION } = actions;

@connect(({ getEmployees, loading }) => ({
  formal: getEmployees.onBoardStaffsList_formal,
  probation: getEmployees.onBoardStaffsList_probation,
  loading: loading.models.getEmployees,
}))
class OnBoardStaffsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'formal',
      keyword: '',
      pageNo: 1,
      pageSize: 20,
    };

    this.dispatch = (fn, payload, meta) => {
      const { dispatch } = this.props;
      return fn(dispatch, { payload, meta });
    };

    this.dispatchAction = () => {
      const { status, ...pageMsg } = this.state;
      pageMsg.status = 'formal';
      this.dispatch(GET_ON_BOARD_STAFFS_LIST_FORMAL, pageMsg);
      pageMsg.status = 'probation';
      this.dispatch(GET_ON_BOARD_STAFFS_LIST_PROBATION, pageMsg);
    };

    this.extra = {
      onRefresh: () => {
        this.dispatchAction();
      },

      onChangePageConfig: (newPageNo, newPageSize) => {
        const { pageNo, pageSize } = this.state;
        this.setState({
          pageNo: newPageNo || pageNo,
          pageSize: newPageSize || pageSize,
        }, () => {
          const { status } = this.state;
          return status === 'formal'
            ? this.dispatch(GET_ON_BOARD_STAFFS_LIST_FORMAL, this.state)
            : this.dispatch(GET_ON_BOARD_STAFFS_LIST_PROBATION, this.state);
        });
      },

      changeState: (name, val) => {
        this.setState({ [name]: val }, () => {
          const { status } = this.state;
          return status === 'formal'
            ? this.dispatch(GET_ON_BOARD_STAFFS_LIST_FORMAL, this.state)
            : this.dispatch(GET_ON_BOARD_STAFFS_LIST_PROBATION, this.state);
        });
      },

      onChange: key => {
        this.setState(
          {
            status: key,
            // keyword: '',
          },
          () => {
            const { status } = this.state;
            return status === 'formal'
              ? this.dispatch(GET_ON_BOARD_STAFFS_LIST_FORMAL, this.state)
              : this.dispatch(GET_ON_BOARD_STAFFS_LIST_PROBATION, this.state);
          }
        );
      },
    };
  }

  componentDidMount() {
    const { status, ...pageMsg } = this.state;
    pageMsg.status = 'formal';
    this.dispatch(GET_ON_BOARD_STAFFS_LIST_FORMAL, pageMsg);
    pageMsg.status = 'probation';
    this.dispatch(GET_ON_BOARD_STAFFS_LIST_PROBATION, pageMsg);
  }

  render() {
    return <OnBoardStadds {...this.extra} payload={this.state} {...this.props} {...this.state} />;
  }
}

export default OnBoardStaffsContainer;
