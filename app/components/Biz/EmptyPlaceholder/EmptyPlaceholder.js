import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import emptyImg from 'assets/images/empty.png';
import styles from './EmptyPlaceholder.less';

class EmptyPlaceholder extends Component {
  static propTypes = {
    size: PropTypes.number, // 占位图大小
    placeholder: PropTypes.string, // 占位文案
  };

  static defaultProps = {
    size: 200,
    placeholder: '',
  };

  render() {
    const { placeholder, size, className } = this.props;
    const cls = classnames({
      [styles.empty]: true,
      [className]: className,
    });
    return (
      <div style={{ width: size }} className={cls}>
        <div style={{ width: size, height: size }}>
          <img src={emptyImg} alt="" />
        </div>
        {placeholder && <div className={styles.text}>{placeholder}</div>}
      </div>
    );
  }
}

export default EmptyPlaceholder;
