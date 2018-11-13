import React, { PureComponent } from 'react';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {List,DatePicker} from 'antd';
import {connect} from 'dva';
import {actions} from 'models/report';
// import moment from 'moment';
// import {Link} from 'dva/router';
import Modal from './Modal';
// import RouterConfig from './Router'
// import {zh_CN as zh} from 'antd/lib/locale-provider/zh_CN';
// import 'moment/locale/zh-cn';
import styles from './Report.less';

// function Month(date) {
//   const months = date.slice(date.length-1,date.length)
//   let temp=date;
//   if(months ==='1'||'3'||'5'||'7'||'8'||'10'||'12'){
//     temp+=`.01-${date}.31`
//   }
//   else if(months==='2'){
//     temp+=`.01-${date}.28`
//   }
//   else{
//     temp+=`.01-${date}.30`

//   }
//   return temp;
// }
const PAYLODA={
  pageNo:1,
  pageSize:20,

}
const {GET_RECORDS,RECORDS} = actions;
@connect(state => ({
  state,
  data:state.report.recordsList,
}))
class Report extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      visible:false,
    }
  }
  componentDidMount(){
    this.dispatch(GET_RECORDS,PAYLODA);
  }
  dispatch = (fn, payload, meta) => {
    const { dispatch } = this.props;
    return fn(dispatch, { payload, meta });
  };
  handdleClick = (item)=>{
      const {history} = this.props;
      const {date} =item;
      // const reg =/^[^\d]*(\d+)[^\d]*$/;
      const flag = item.recorded;
      // title.replace(reg,'$1');
      const months = date.slice(date.length-1,date.length)
      // const states = item;
      const path = {
      pathname:`/salary_report/details/${months}`,
      query:flag,
    }
     history.push(path)
  }
  handdleRecords = (e)=>{
    e.stopPropagation();

    this.setState({visible:true})
    // this.handleOk();

  }
  handleOk = ()=>{
    new Promise((resolve,reject)=>{
      this.dispatch(RECORDS,{resolve,reject});
    }).then(this.dispatch(GET_RECORDS,PAYLODA));
    this.setState({visible:false});
  }
  handleCancel = ()=>{
    this.setState({visible:false});
  }
  render() {
    // const data=[{
    //   title:'2018.05.01-2018.05.31',
    // }];
    const pagination = {
      hideOnSinglePage: true,
      // showQuickJumper: true,
      // showSizeChanger:true,
      
    };

    // pagination.current = data.pageable.pageNumber + 1;
    // pagination.total = data.totalElements;
    // moment.locale('zh-cn');
    const { data } = this.props;
    const months=[];
    const unrecord=[];
    const records=[];
    if(data){
      const {content} =data.data;
      
      for(let i =0 ;i < content.length;i+=1){
        
        if(!content[i].recorded){
          // const temp=content[i].date.replace(/-/g,'.');
          // const date = Month(temp);
          // content[i].date=date;
          unrecord.push(content[i]);
        }
        else{
          // const temp=content[i].date.replace(/-/g,'.');
          // const date = Month(temp);
          // content.date=date;
          records.push(content[i])
        }
      }
      //  let temp = data.data.content.slice(0);
      //  months.push(temp[0].date)
      //  temp=data.data.content.slice(1,data.data.content.length-1)?data.data.content.slice(1,data.data.content.length):null;
      //  for(let i =0;i<temp.length;i+=1){
      //  records.push(temp[i].date);
      //  }
      months.push(unrecord[0]);

    }
    

    const dateFormat = 'YYYY/MM/DD';
    return (
      
        <div className={styles.report}>
          <header className={styles.header}>
            <span className={styles.title}>报表</span>
          </header>
          <span className={styles.title1}>本月报表</span>
        <div className={styles.list}>
          <List dataSource={months}
                renderItem={item =>(
                  // <Link to={path}>
                    <List.Item onClick={()=>this.handdleClick(item)}>
                      <List.Item.Meta title={item.date}/>
                      <i className='icon-o-folder' onClick={this.handdleRecords} >
                      归档
                      </i>
                    </List.Item>
                  // </Link>
                )}
          />
        </div>
        <div className={styles.header1}>
          <span className={styles.title2}>已归档报表<div className={styles.arrow}/> </span>
          {/* <LocaleProvider locale={zh}> */}
          <DatePicker.RangePicker 
            locale={locale}
            className={styles.date}
            // defaultValue={[moment('2018-01-01', dateFormat), moment('2018-12-01', dateFormat)]}
            format={dateFormat}
          />
          {/* </LocaleProvider> */}
         </div>
         <div className={styles.list}>
          <List dataSource={records}
            pagination={pagination}
            renderItem={item =>(
              // <Link to={`/setting/personnel/customField/${data.id}`}>
                <List.Item onClick={()=>this.handdleClick(item)}>
                    <List.Item.Meta title={item.date}/>
                </List.Item>
              // </Link>

                )}
          />
          <Modal 
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            />

       
        </div>
        
        {/* <Switch>
          <Route exact path="/salary_report/details" component={Details} />
        </Switch> */}
      </div>
    );
  }
}
export default Report;