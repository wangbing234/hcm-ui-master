import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import getFetchTable from './FetchTable';

export default function withFetch({ action, modelName, getData }) {
  const FetchTable = getFetchTable(modelName, getData);

  @connect(state => state)
  class FetchData extends PureComponent {
    static displayName = 'FetchData';

    static propTypes = {
      actionPayload: PropTypes.object,
      headerActions: PropTypes.array,
      itemActions: PropTypes.array,
      onChangePageConfig: PropTypes.func,
      onRowClick: PropTypes.func,
    };

    static defaultProps = {
      actionPayload: {},
      itemActions: [],
      headerActions: [],
      onChangePageConfig: () => {},
      onRowClick: () => {},
    };

    componentDidMount() {
      this.fetchDataSource(this.props);
    }

    componentDidUpdate(prevProps) {
      const { actionPayload } = this.props;
      if (prevProps.actionPayload !== actionPayload) {
        this.fetchDataSource(this.props);
      }
    }

    fetchDataSource = props => {
      if (action && typeof action === 'function') {
        action(props.dispatch, { payload: props.actionPayload });
      }
    };

    render() {
      const { actionPayload, ...props } = this.props;
      return <FetchTable {...props} />;
    }
  }

  return FetchData;
}
