import React, { Component, Children } from "react";
import PropTypes from 'prop-types';
import classnames from 'classnames';
import "./Tab.less";


class Tab extends Component {

  static propTypes = {
		defaultActiveTab: PropTypes.string, // 默认选中的 tab
		onChange: PropTypes.func,  // 文件变化回调函数
  };

  static defaultProps = {
		defaultActiveTab: undefined,
		onChange: () => {},
	}

	state = {
    activeTab: this.props.defaultActiveTab,
  };

  onChange = (props) => {
    const { id } = props;
    const { onChange } = this.props;
    this.setState({
      activeTab: id,
    });
    onChange(id);
  }

  render() {
    const { activeTab } = this.state;
    const { children, className } = this.props;

    // 高亮 tab
    const isActiveTab = (child, index) => {
      if (activeTab !== undefined && activeTab === child.props.id) {
        return true;
      }
      // 没有传递默认值，选中第一个 tab
      if(activeTab === undefined && index === 0) {
        return true;
      }
      return false;
    }

    return (
			<div className={classnames('hcm-tabs', className)}>
        <div className="hcm-tabs-nav">
          {
              Children.map(children, (child, index) =>
                (<div
                    className={classnames('hcm-tabs-nav-item', {
                      'hcm-tabs-nav-item-active': isActiveTab(child, index),
                    })}
                    onClick={() => this.onChange(child.props)}
                  >
                    {child.props.title}
                  </div>
                )
              )
          }
        </div>
        <div className="hcm-tabs-body">
          {
            Children.map(children, (child, index) => {
              if (isActiveTab(child, index)) {
                return child;
              }
            })
          }
        </div>
      </div>
    );
  }
}

export default Tab;
