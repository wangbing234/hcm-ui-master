import React, { PureComponent } from 'react';

import { DETAIL_MAP_LAYOUT } from 'constants/employee';

import HeaderInfo from './HeaderInfo';
import SessionInfo, { Session } from './SessionInfo';

import styles from './Detail.less';

const SESSION_INFO = [
  {
    key: 'positionInfo',
    title: '岗位信息',
  },
  {
    key: 'basicInfo',
    title: '基本信息',
  },
  {
    key: 'otherInfo',
    title: '其他信息',
  },
];

export default class Entry extends PureComponent {
  constructor(props) {
    super(props);

    this.sessionProps = SESSION_INFO.map(({ key, title }) => ({
      key,
      title,
      onChange: this.onChangeWithSession(key),
      onPlusForm: this.onPlusFormWithSession(key),
      onTrashForm: this.onTrashFormWithSession(key),
    }));
  }

  onChangeWithSession = sessionName => {
    const { onChangeWithSession } = this.props;
    return (id, formIdx, code, value) => {
      onChangeWithSession(sessionName, `${id}`, formIdx, code, value);
    };
  };

  onPlusFormWithSession = sessionName => {
    return id => {
      const { onPlus } = this.props;
      onPlus(sessionName, id);
    };
  };

  onTrashFormWithSession = sessionName => {
    return (id, formIdx) => {
      const { onTrash } = this.props;
      onTrash(sessionName, `${id}`, formIdx);
    };
  };

  render() {
    const { data, error, layout, onChangeWithHeader } = this.props;
    return (
      <div className={`${styles.detail} ${styles.entry}`}>
        <Session title="员工入职">
          <HeaderInfo data={data.get('header')} error={(error || {}).header} onChange={onChangeWithHeader} />
        </Session>
        {this.sessionProps.map(props => (
          <SessionInfo
            {...props}
            data={data.get(props.key)}
            error={(error || {})[props.key]}
            config={layout[DETAIL_MAP_LAYOUT[props.key]].filter( ({onBoard}) => onBoard )}
          />
        ))}
      </div>
    );
  }
}
