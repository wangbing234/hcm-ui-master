import React, { PureComponent } from 'react';
import {connect} from 'dva';
// import { actions } from 'models/report';
import {actions} from 'models/report';

import Header from './Header';
import Table from './Table';
import styles from './Report.less';
import Modal from './Modal';

const { EXPORT_EXCEL,RECORDS,GET_REPORT,ACCOUNTING,SALARY_ITEM} = actions;
const PAYLODA={
    pageNo:1,
    pageSize:20,
  
  }
@connect(state => ({
    state,
    data:state.report.salaryItem,
  }))
export default class Details extends PureComponent{
    constructor(props){
        super(props);
        this.state ={
            flag:null,
            visible:false,
        }
    }
    componentWillMount(){
        const data =this.props.match.params;
        PAYLODA.month=data.month;
        const flag= this.props.location.query;
        if(flag){
            this.setState({flag:'archive'})
        }
        this.dispatch(GET_REPORT,PAYLODA);
        this.dispatch(SALARY_ITEM);
    }
    onArchive=()=>{
        this.setState({
            flag:'archive',
            visible: false,
        });
        this.dispatch(RECORDS);
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    handleOk = ()=> {
        this.setState({
            visible:false,
            flag:'confirm',  
        });
        this.dispatch(ACCOUNTING);

      }
    handleCancel = ()=> {
        this.setState({visible:false});
      }
    openCancel =()=>{
        this.setState({flag:null});
    }
    handdleExport =()=>{
        this.dispatch(EXPORT_EXCEL);
    }
    dispatch = (fn, payload, meta) => {
        const { dispatch } = this.props;
        return fn(dispatch, { payload, meta });
      };
    render(){
        return(
            <div className={styles.unaccounted}>
                <Header flag={this.state.flag} openConfirm={this.showModal} openCancel={this.openCancel} onArchive={this.showModal} />
                <Table handdleExport={this.handdleExport} {...this.props}/>
                <Modal 
                flag={this.state.flag}
                visible={this.state.visible}
                onOk={this.state.flag===null?this.handleOk:this.onArchive}
                onCancel={this.handleCancel}
                />
            </div>
        )
    }

}
