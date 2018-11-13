import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import logo from 'assets/images/logo.svg';
import './Brand.less';

class Brand extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    to: PropTypes.string,
  };

  static defaultProps = {
    text: '',
    to: '',
  };

  render() {
    const { to, text, className } = this.props;
    const cls = classNames({
      'hcm-ui-brand': true,
      [className]: className,
    });
    return (
      <Link to={to} className={cls}>
        <img alt="有招" src={logo} />
        <p>{text}</p>
      </Link>
    );
  }
}

export default Brand;
