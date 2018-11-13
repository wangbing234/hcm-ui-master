import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import loadingImg from 'assets/images/loading.gif';
import styles from './Loading.less';

class Loading extends Component {
  static propTypes = {
    indicator: PropTypes.node,
    visible: PropTypes.bool,
    center: PropTypes.bool,
    text: PropTypes.string,
    scale: PropTypes.number,
  };

  static defaultProps = {
    indicator: <img style={{ width: 50, height: 50 }} alt="Loading" src={loadingImg} />,
    visible: false, // 是否显示
    center: false, // 是否居中
    text: '', // 文本
    scale: 1, // 放大比例
  };

  render() {
    const { indicator, text, visible, center, scale, className } = this.props;

    const cls = classnames({
      [styles.loading]: true,
      [styles.center]: center,
      className,
    });

    const scaleStyle = {
      transform: scale > 1 && `scale(${scale})`,
    };

    const element = (
      <div className={cls}>
        <div className={styles.wrapper}>
          <div style={scaleStyle} className={styles.inner}>
            <div className={styles.indicator}>{indicator}</div>
            {text && <div className={styles.text}>{text}</div>}
          </div>
        </div>
      </div>
    );

    if (visible === false) {
      return null;
    }

    return element;
  }
}

export default Loading;
