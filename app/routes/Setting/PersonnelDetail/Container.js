import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Modal } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { createPromiseDispatch } from 'utils/actionUtil';
import { actions, ACTION_NAMES } from 'models/settingPersonnelDetail';
import Card from 'components/Card';
import { confirm } from 'components/Confirm';
import { Row, Column } from 'layouts/FormLayout';
import { Input, Select, Button, Loading } from 'components/Base/';
import FormBox from 'components/FormBox';
import LeftSider from './LeftSider';
import DropTarget from './DropTarget';
import RightSider from './RightSider';
import { getFieldDataByFieldType } from './filedsModel';
import styles from './Container.less';

const { Option } = Select;

const {
  RESET_STATE,
  RESET_ERROR,

  FETCH_FORM,
  SUBMIT_FORM,
  EDIT_FORM,

  UPDATE_FORM,
  UPDATE_FORM_ERROR,

  ADD_FIELD,
  DEL_FIELD,
  SELECT_FIELD,
  SWAP_FIELD,
  UPDATE_FIELD,

  ADD_OR_DEL_OPTION,
} = actions;

@connect(({ settingPersonnelDetail = {}, loading, error }) => ({
  error: error.settingPersonnelDetail,
  loading: loading.models.settingPersonnelDetail,
  ...settingPersonnelDetail,
}))
@DragDropContext(HTML5Backend)
class Detail extends Component {

  componentDidMount() {
    this.handleFormType();
  }


  componentDidUpdate(prevProps) {
    this.handleBackendError(prevProps);
  }

  //  拖拽完成后
  onEndDrag = fieldType => {
    const filedData = getFieldDataByFieldType(fieldType);
    this.dispatch(ADD_FIELD, filedData);
    return filedData;
  };

  // 选中字段
  onSelectField = index => {
    this.dispatch(SELECT_FIELD, index);
  };

  // 删除字段
  onDeleteField = (e, index) => {
    e.stopPropagation();
    confirm({
      title: '是否删除？',
      content: '已经储存了数据，如果删除，则无法恢复！',
      okText: '删除',
      centered: true,
      onOk: () => {
        this.dispatch(DEL_FIELD, index);
      },
    });
  };

  // 交换字段
  onSwapField = (e, index, targetIndex) => {
    if (e) {
      e.stopPropagation();
    }
    this.dispatch(SWAP_FIELD, { index, targetIndex });
  };

  // 更新编辑字段
  onUpdateField = (code, value) => {
    this.dispatch(UPDATE_FIELD, { code, value });
  };

  // 添加或删除选项
  onOptionAction = index => {
    this.dispatch(ADD_OR_DEL_OPTION, index);
  };

  // 更新控件选项
  onOptionUpdate = (code, value, index) => {
    this.dispatch(UPDATE_FIELD, { code, value, index });
  };

  promiseDispatch = createPromiseDispatch();

  // 更新表单
  handleUpdateForm = (code, value) => {
    this.dispatch(UPDATE_FORM, { code, value });
  };

  // 处理新建还是编辑逻辑
  handleFormType = () => {
    const { match } = this.props;
    const { id, type } = match.params;

    // 进入时先重置 state
    this.dispatch(RESET_STATE, {});

    // 重置错误信息
    this.dispatch(RESET_ERROR, {
      [ACTION_NAMES.FETCH_FORM]: undefined,
      [ACTION_NAMES.EDIT_FORM]: undefined,
    });

    // 编辑
    if (id) {
      this.dispatch(FETCH_FORM, id);
    }
    // 类型
    if (type) {
      this.handleUpdateForm('type', type);
    }
  };

  // 提交表单
  handleSubmitForm = () => {
    const { formData, fields, match } = this.props;
    const { id, type } = match.params;

    // 校验
    const errors = this.validateAll();
    this.dispatch(UPDATE_FORM_ERROR, errors);
    if (errors && errors.size) {
      return;
    }

    // 删除多余字段
    const newFileds = fields.map(filed => {
      const newField = filed.delete('uid').delete('selected');
      return newField;
    });
    const newFormData = formData.set('fields', newFileds);

    // 新建
    if (type) {
      this.promiseDispatch(SUBMIT_FORM, newFormData.toJS())
      .then(this.redirect2List);
    }
    // 编辑
    if (id) {
      this.promiseDispatch(EDIT_FORM, {
        body: newFormData.toJS(),
        id,
      }).then(this.redirect2List);
    }
  };

  // 处理后端错误
  handleBackendError = prevProps => {
    const { error: prevError } = prevProps;
    const { error } = this.props;

    if (prevError && error) {
      if (prevError.FETCH_FORM !== error.FETCH_FORM) {
        if (error.FETCH_FORM) {
          Modal.error({
            title: error.FETCH_FORM.message,
            content: error.FETCH_FORM.message,
            onOk: this.redirect2List,
          });
        }
      }
    }
  };

  // 预览表单
  handlePreviewForm = () => {};

  // 校验字段
  validate = (code, value, msg = '请填写该字段') => {
    const { formError } = this.props;
    let errors = formError;
    if (!value) {
      errors = errors.set(code, msg);
    } else {
      errors = errors.delete(code);
    }
    this.dispatch(UPDATE_FORM_ERROR, errors);
    return errors;
  };

  // 校验必要字段
  validateAll = () => {
    const { formData } = this.props;
    const errors = this.validate('title', formData.get('title'), '请填写模块名称');
    return errors;
  };

  //  跳转到列表
  redirect2List = () => {
    const { history } = this.props;
    history.push('/setting/personnel/customField/');
  };

  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };

  render() {
    const {
      fields,
      selectedField,
      formData,
      formError,
      fieldError,
      loading,
    } = this.props;

    // 判断字段中是否有错误信息
    const hasFormError = formError.size;
    const hasFieldError = fieldError.toString().indexOf(true) > -1;
    const btnDisabled = hasFormError || hasFieldError;

    return (
      <Layout style={{ height: '100%', position: 'relative' }}>
        <LeftSider onEndDrag={this.onEndDrag} />
        <div className={styles.main}>
          <Loading visible={loading} center />
          <Card className={styles.formCard}>
            <Row>
              <Column>
                <FormBox label="模块名称" isRequired errorMsg={formError.get('title')}>
                  <Input
                    placeholder="请填写"
                    value={formData.get('title')}
                    onChange={e => {
                      this.validate('title', e.target.value, '请填写模块名称');
                      this.handleUpdateForm('title', e.target.value);
                    }}
                  />
                </FormBox>
              </Column>
              <Column>
                <FormBox label="是否支持多条记录" isRequired={false}>
                  <Select
                    number2boolean
                    value={formData.get('multiRecord')}
                    className={styles.autoWidth}
                    onChange={value => {
                      this.handleUpdateForm('multiRecord', value);
                    }}
                  >
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                </FormBox>
              </Column>
            </Row>
            <Row>
              <Column>
                <FormBox label="该模块是否必填" isRequired={false}>
                  <Select
                    number2boolean
                    value={formData.get('required')}
                    className={styles.autoWidth}
                    onChange={value => {
                      this.handleUpdateForm('required', value);
                    }}
                  >
                    <Option value={1}>必填</Option>
                    <Option value={0}>选填</Option>
                  </Select>
                </FormBox>
              </Column>
              <Column>
                <FormBox label="员工入职时是否启用" isRequired={false}>
                  <Select
                    number2boolean
                    value={formData.get('onBoard')}
                    className={styles.autoWidth}
                    onChange={value => {
                      this.handleUpdateForm('onBoard', value);
                    }}
                  >
                    <Option value={1}>启用</Option>
                    <Option value={0}>不启用</Option>
                  </Select>
                </FormBox>
              </Column>
            </Row>
          </Card>
          <Card className={styles.dropCard}>
            <header className={styles.header}>
              <div className={styles.btns}>
                <Button onClick={this.redirect2List}>取消</Button>
                <Button
                  type="primary-light"
                  disabled={btnDisabled}
                  onClick={this.handlePreviewForm}
                >
                  预览
                </Button>
                <Button type="primary" disabled={btnDisabled} onClick={this.handleSubmitForm}>
                  保存
                </Button>
              </div>
              <b className={styles.title}>编辑表单</b>
            </header>
            <DropTarget
              onDeleteField={this.onDeleteField}
              onSelectField={this.onSelectField}
              onSwapField={this.onSwapField}
              fields={fields}
            />
          </Card>
        </div>
        <RightSider
          selectedField={selectedField}
          onUpdateField={this.onUpdateField}
          onOptionAction={this.onOptionAction}
          onOptionUpdate={this.onOptionUpdate}
        />
      </Layout>
    );
  }
}

export default Detail;
