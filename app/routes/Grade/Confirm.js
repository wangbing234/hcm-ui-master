import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Modal, Tooltip } from 'antd';

import { Button } from 'components/Base';

import styles from './grade.less';

export default class Confirm extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    hint: PropTypes.string,
    actions: PropTypes.array,
  };

  static defaultProps = {
    visible: false,
    title: '',
    hint: '',
    actions: [],
  };

  render() {
    const { actions, visible, title, hint } = this.props;
    return (
      <Modal
        width={250}
        closable={false}
        footer={null}
        visible={visible}
        wrapClassName={styles.confirm}
      >
        <div className={styles.title}>
          {title}
          <Tooltip overlayClassName={styles.tooltip} placement="bottomLeft" title={hint}>
            <span className={`icon-o-info ${styles.hint}`} />
          </Tooltip>
        </div>
        <footer className={styles.footer}>
          {actions && actions.map(props => <Button key={props.children}  {...props} />)}
        </footer>
      </Modal>
    );
  }
}
