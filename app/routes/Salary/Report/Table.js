import React, { PureComponent } from 'react';
// import {actions} from 'models/report';
import { Button } from 'components/Base';
import {Table as AntTable} from 'antd';
import styles from './Report.less'

// const {GET_REPORT} =actions;

export default class Table extends PureComponent{
    
    render(){
        let ALL_COLUMNS = [];
       


        const {data} =this.props;
        if(data){
            for(const i in data.data){
                if(data.data[i]){
                ALL_COLUMNS.push(data.data[i]);
                
                }
            }
        }
        const temp= JSON.parse(JSON.stringify(ALL_COLUMNS).replace(/code/g,"dataIndex"));
        ALL_COLUMNS=JSON.parse(JSON.stringify(temp).replace(/name/g,"title"));
        const {handdleExport} = this.props;
        return(
            <div className={styles.span}>
                <Button className={styles.button} type="primary-light" onClick={handdleExport} >导出 Excel</Button>
                <AntTable bordered className={styles.table} columns={ALL_COLUMNS} locale={
                { emptyText: (<div className={styles.tableEmptyPlaceholder}>暂无数据</div>) }
                }/>
            </div>
        )
    }
}