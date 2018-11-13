import React, { Component } from 'react';
import { createPromiseDispatch } from 'utils/actionUtil';
import { Button } from 'components/Base';
import { connect } from 'dva';
import { actions } from 'models/settingTaxSetting';
import { InputNumber,Row, Col  } from 'antd';
import styles from './Tax.less';

const { GET_TAX_LIST, EDIT_TAX } = actions;

@connect(({ settingTaxSetting = {}, loading }) => ({
  taxList: settingTaxSetting.taxList,
  loading: loading.models.settingTaxSetting,
}))
class TaxSetting extends Component {
  state = {
    isEditForeign: false,
    isEditChina: false,
    num: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    GET_TAX_LIST(dispatch, {});
  }

  onRefresh = () => {
    const { dispatch } = this.props;
    GET_TAX_LIST(dispatch, {});
  };

  promiseDispatch = createPromiseDispatch();

  closeEdit = val => {
    this.setState({
      num: undefined,
    });
    if (val === 1) {
      this.setState({ isEditChina: false });
    } else {
      this.setState({ isEditForeign: false });
    }
  };

  openEdit = (val, point) => {
    this.setState({
      num: point,
    });
    if (val === 1) {
      this.setState({ isEditChina: true });
    } else {
      this.setState({ isEditForeign: true });
    }
  };

  saveOn = id => {
    if(typeof this.state.num === 'number'){
      this.promiseDispatch(EDIT_TAX, {
        id,
        point: this.state.num,
      }).then(() => {
        this.onRefresh();
        this.closeEdit(id);
        this.setState({
          num: undefined,
        });
      });

    }
  };

  line() {
    const { isEditForeign, isEditChina } = this.state;
    const { taxList } = this.props;
    const List = taxList || [{ id: 0, point: 0 }, { id: 1, point: 0 }];
    return List.map(item => {
      const isEdit = item.id === 1 ? isEditChina : isEditForeign;
      return (
        <div key={item.id}>
          {!isEdit && (
            <div className={styles.line}>
              <Row>
                <Col span={8}>
                  <span>{item.name}</span>
                </Col>
                <Col
                  style={{
                    textAlign: 'center',
                  }}
                  span={8}
                >
                  <span>{item.point}</span>
                </Col>
                <Col
                  style={{
                    textAlign: 'right',
                  }}
                  span={8}
                >
                  <span
                    className={styles.setting}
                    onClick={() => this.openEdit(item.id, item.point)}
                  >
                    修改
                  </span>
                </Col>
              </Row>
            </div>
          )}

          {isEdit && (
            <div className={styles.line}>
              <Row>
                <Col span={12}>
                  <span>{item.name}</span>
                </Col>

                <Col
                  style={{
                    textAlign: 'right',
                  }}
                  span={12}
                >
                  <span
                    className={styles.close}
                    onClick={() => this.closeEdit(item.id)}
                  >
                    取消
                  </span>
                </Col>
              </Row>

              <Row>
                  <InputNumber
                    defaultValue={item.point}
                    onChange={value => {
                      if(typeof value === 'number'){
                        this.setState({
                          num: value,
                        });

                      }
                    }}
                  />
                  <Button
                    type="primary-light"
                    style={{ float: 'right' }}
                    onClick={() => this.saveOn(item.id)}
                  >
                    保存
                  </Button>
              </Row>
            </div>
          )}
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.main}>
        <h6 className={styles.title}>免税额</h6>
        {this.line()}
      </div>
    );
  }
}

export default TaxSetting;
