import React, { PureComponent } from 'react';
import { TABLE_DEFAULT_COLUMNS } from 'constants/setting';
import { connect } from 'dva';
import { actions } from 'models/personnel';
import Header from './Header';
import DeleteConfirm from './DeleteConfirm';
import Table from './Table';
import styles from './personnel.less';

const { ACTIVE_PERSONNEL, SORT_PERSONNEL } = actions;

@connect(state => state)
export default class Personnel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleteId: null,
    };
  }

  handdleUp = (id, temp) => {
    const { onRefresh } = this.props;
    const ids = [];
    for (const i in temp) {
      if (i) {
        ids.push(temp[i].id);
      }
    }
    const index = ids.indexOf(id);

    if (index > 0) {
      [ids[index], ids[index - 1]] = [ids[index - 1], ids[index]];
    }
    new Promise((resolve, reject) => {
      this.dispatch(SORT_PERSONNEL, { ids, resolve, reject });
    }).then(() => onRefresh());
  };

  handdleDown = (id, temp) => {
    const { onRefresh } = this.props;
    const ids = [];
    for (const i in temp) {
      if (i) {
        ids.push(temp[i].id);
      }
    }
    const index = ids.indexOf(id);
    if (index < temp.length - 1) {
      [ids[index + 1], ids[index]] = [ids[index], ids[index + 1]];
    }
    new Promise((resolve, reject) => {
      this.dispatch(SORT_PERSONNEL, { ids, resolve, reject });
    }).then(() => onRefresh());
  };

  handdleMove = (source, target, temp) => {
    const { onRefresh } = this.props;
    const ids = [];
    let index = 0;
    for (const i in temp) {
      if (i) {
        ids.push(temp[i].id);
      }
    }
    index = ids.slice(source, source + 1);
    ids.splice(source, 1);
    ids.splice(target, 0, index[0]);
    window.console.log(ids);
    new Promise((resolve, reject) => {
      this.dispatch(SORT_PERSONNEL, { ids, resolve, reject });
    }).then(() => onRefresh());
  };

  handdleDelete = data => {
    const { onRefresh } = this.props;
    // this.dispatch(DELETE_PERSONNEL, { data });
    // onRefresh();
    this.setState({ deleteId: data });
    onRefresh();
  };

  handdleActive = payload => {
    const { onRefresh } = this.props;

    // const data = {
    //   id: payload.id,
    //   enable: !payload.enable,
    // };
    new Promise((resolve,reject) => {
      this.dispatch(ACTIVE_PERSONNEL, {id: payload.id,
        enable: !payload.enable,resolve,reject});  
    }).then(() => onRefresh());
    
  };

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };

  render() {
    let temp = [];
    const { dispatch, title, data, loaction, onRefresh, ...props } = this.props;
    const { deleteId } = this.state;
    if (data) {
      temp = title === '基本信息' ? data.basic : title === '岗位信息' ? data.position : data.other;
    }
    // if(data.basicForms)
    const SwitchActions = [
      {
        action: payload => this.handdleActive(payload),
      },
    ];
    const ItemActions = [
      {
        action: ({ id }) => this.onActive(id),
        icon: 'icon-menu-1',
      },
    ];
    const tableItemActions = [
      {
        action: ({ id }) => this.handdleUp(id, temp),
        icon: 'arrow-up',
      },
      {
        action: ({ id }) => this.handdleDown(id, temp),
        icon: 'arrow-down',
      },
      {
        // action: ({ id }) => this.handdleEdit(id),
        icon: 'edit',
      },
      {
        action: ({ id }) => this.handdleDelete(id),
        icon: 'delete',
      },
    ];
    return (
      <div className={styles.personnel}>
        <Header className={styles.header} title={title} />
        <Table
          className={styles.tables}
          itemActions={tableItemActions}
          frontItemActions={ItemActions}
          switchActions={SwitchActions}
          columns={TABLE_DEFAULT_COLUMNS}
          // onActive={this.onActive}
          {...props}
          data={temp}
          handdleMove={this.handdleMove}
          onRow={index => {
            return { onclick: () => this.onActive(index) };
          }}
          title={title}
          location={location}
        />
        <DeleteConfirm
          id={deleteId}
          onRefresh={onRefresh}
          onDeleted={() => {
            onRefresh();
            this.handdleDelete();
          }}
          onCancel={this.handdleDelete}
        />
      </div>
    );
  }
}
