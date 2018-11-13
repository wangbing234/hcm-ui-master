import React, { Component } from 'react';
import * as Immutable from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { connect } from 'dva';
import { Link } from 'dva/router';

import { actions } from 'models/rolePermission';
import { createPromiseDispatch } from 'utils/actionUtil';

import { Input, Modal, Button } from 'components/Base';
import FormBox from 'components/FormBox';
import { Layout, Row, Column } from 'layouts/FormLayout';
import styles from './Permission.less';

const {
	CREATE_ROLE,
	EDIT_ROLE,
	DELETE_ROLE,
} = actions;

@connect(({ rolePermission = {}, loading }) => ({
  loading: loading.models.rolePermission,
  ...rolePermission,
}))
class RoleList extends Component {
	static propTypes = {
    currentRoleId: PropTypes.number.isRequired,
		roles: PropTypes.object.isRequired,
    onRefreshList: PropTypes.func.isRequired,
  };

	constructor(props) {
    super(props);
    this.state = {
			isAddModalOpen: false,
			isEditModalOpen: false,
			isDeleteModalOpen: false,
			formData: Immutable.fromJS({}),
			errors: Immutable.fromJS({}),
		};
  }

  onAddRole(data) {
    const { onRefreshList } = this.props;
		this.promiseDispatch(CREATE_ROLE, { name: data })
			.then((id) => {
        this.onCancel();
				onRefreshList(id);
			})
      .catch(err => {
        let { errors } = this.state;
        errors = errors.set('name', err.meta.message);
        this.setState({
          errors,
        });
      });
	}

	onEditRole(data) {
    const { onRefreshList } = this.props;
		this.promiseDispatch(EDIT_ROLE, { name: data.get('name'), id: data.get('id') })
			.then(() => {
        this.onCancel();
				onRefreshList();
			})
      .catch(err => {
        let { errors } = this.state;
        errors = errors.set('name', err.meta.message);
        this.setState({
          errors,
        });
      });
	}

	onDeleteRole(data) {
    const { onRefreshList } = this.props;
		this.promiseDispatch(DELETE_ROLE, { id: data.get('id') })
			.then(() => {
        this.onCancel();
				onRefreshList();
			});
	}

	onChange(type, value) {
		const { formData } = this.state;
		this.validate(type, value);
		const newData = formData.set(type, value);
		this.setState({
			formData: newData,
		});
  }

	onCancel() {
		this.setState({
			isAddModalOpen: false,
			isEditModalOpen: false,
			isDeleteModalOpen: false,
			formData: Immutable.fromJS({}),
			errors: Immutable.fromJS({}),
		});
	}

  promiseDispatch = createPromiseDispatch();

	validate(type, value) {
		let { errors } = this.state;
    if (type === 'name') {
      if (!value) {
        errors = errors.set('name', '请输入角色名称');
      } else {
        errors = errors.delete('name');
      }
    }
		this.setState({
			errors,
		})
	}

	validateAll() {
		const { formData, errors } = this.state;
		let newError = errors;
    if (!formData.get('name')) {
      newError = newError.set('name', '请输入角色名称');
    }
		return newError;
	}

	handleAdd() {
		const errors = this.validateAll();
		if (errors && errors.size > 0) {
			this.setState({
				errors,
			});
		} else {
			const { formData } = this.state;
			this.onAddRole(formData.get('name'));
		}
	}

	handleEdit() {
		const errors = this.validateAll();
		if (errors && errors.size > 0) {
			this.setState({
				errors,
			});
		} else {
			const { formData } = this.state;
			this.onEditRole(formData);
		}
	}

	renderAddModal() {
		const { isAddModalOpen, formData, errors } = this.state;
		const footer = (
      <div>
        <Button onClick={() => this.onCancel()}>取消</Button>
        <Button type="primary" onClick={() => this.handleAdd()}>确认</Button>
      </div>
    );

		return (
      <Modal
        small
        onCancel={() => this.onCancel()}
        maskClosable={false}
        visible={isAddModalOpen}
        title='新增角色'
        footer={footer}
      >
        <Layout>
          <Row cols={1}>
            <Column>
              <FormBox label="角色名称" isRequired errorMsg={errors.get('name')}>
                <Input
                  value={formData.get('name')}
                  error={!!errors.get('name')}
                  onChange={e => this.onChange('name', e.target.value)}
                />
              </FormBox>
            </Column>
          </Row>
        </Layout>
      </Modal>
    );
	}

	renderEditModal() {
		const { isEditModalOpen, formData, errors } = this.state;
		const footer = (
      <div>
        <Button onClick={() => this.onCancel()}>取消</Button>
        <Button type="primary" onClick={() => this.handleEdit()}>确认</Button>
      </div>
    );

		return (
      <Modal
        small
        onCancel={() => this.onCancel()}
        maskClosable={false}
        visible={isEditModalOpen}
        title='编辑角色'
        footer={footer}
      >
        <Layout>
          <Row cols={1}>
            <Column>
              <FormBox label="角色名称" isRequired errorMsg={errors.get('name')}>
                <Input
                  value={formData.get('name')}
                  error={!!errors.get('name')}
                  onChange={e => this.onChange('name', e.target.value)}
                />
              </FormBox>
            </Column>
          </Row>
        </Layout>
      </Modal>
    );
	}

	renderDeleteModal() {
		const { formData, isDeleteModalOpen } = this.state;

		const title = (
      <div className={styles.modalHeaderWrapper}>
        <span className={styles.modalHeader}>删除角色</span>
      </div>
    );

		const footer = (
      <div>
        <Button onClick={() => this.onCancel()}>取消</Button>
        <Button type="danger" onClick={() => this.onDeleteRole(formData)}>删除</Button>
      </div>
    );

		return (
      <Modal
        small
        onCancel={() => this.onCancel()}
        maskClosable={false}
        visible={isDeleteModalOpen}
        title={title}
        footer={footer}
      >
        <Layout>
          <Row cols={1}>
            <Column>
              <span className={styles.deleteTip}>是否确定删除该角色？如果删除，所有关联的员工都会失去该角色权限。</span>
            </Column>
          </Row>
        </Layout>
      </Modal>
    );
	}

  render() {
		const { currentRoleId, roles } = this.props;
    return (
      <div className={styles.listWrapper}>
        <div className={styles.listHeader}>角色名称</div>
        {roles.map((role) => {
					const isSelected = role.get('id') === currentRoleId;
					return (
            <div
              key={role.get('id')}
              title={role.get('name')}
              className={classnames(styles.roleItem, {
                [styles.selectedItem]: isSelected,
              })}
            >
              <Link className={styles.role} to={`/role_permission/${role.get('id')}`}>
                {role.get('name')}
              </Link>
              <div
                className={styles.toolsWrapper}
              >
                <span
                  className="icon-edit"
                  onClick={() => {
                    this.setState({
                      isEditModalOpen: true,
                      formData: role,
                    });
                  }}
                />
                <span
                  className="icon-o-trash"
                  onClick={() => {
                    this.setState({
                      isDeleteModalOpen: true,
                      formData: role,
                    });
                  }}
                />
              </div>
            </div>
					);
				})}
        <Button className={styles.addButton} type="primary-light" onClick={() => {this.setState({isAddModalOpen: true})}}>
          <span className="icon-plus" />
					添加角色
        </Button>
        {this.renderAddModal()}
        {this.renderEditModal()}
        {this.renderDeleteModal()}
      </div>
		);
  }
}

export default RoleList;
