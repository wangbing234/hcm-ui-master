import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

/*
在Comp外层包装一层自动获取api数据的组件，除了actionPayload，其他参数会透传
action: model取出来的EffectAction
mapStateToProps: 与connect的mapStateToProps一致，返回的props会传给Comp
*/
// withFetch :: (EffectAction ea, mapStateToProps s2p, Component c) => (ea, s2p) -> c -> c
export default function withFetch(action, mapStateToProps = state => state) {
  // Comp: 最终渲染的组件，如HCMTable
  return (Comp) => {
    @connect(mapStateToProps)
    class FetchData extends PureComponent {
      static displayName = 'FetchData';

      static propTypes = {
        // action的请求参数，发生变换时，重新获取参数
        actionPayload: PropTypes.any,
      };

      static defaultProps = {
        actionPayload: {},
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
        return <Comp {...props} />;
      }
    }

    return FetchData;
  };
}
