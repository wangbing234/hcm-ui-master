import React,{PureComponent} from 'react';
import {Modal as Confirm} from 'antd';
import styles from './Report.less'

export default class Modal extends PureComponent{
    render(){
        const {visible,onOk,onCancel,flag} = this.props;
       
        return(
            <Confirm 
            className={styles.confirm}
            visible={visible}
            title={(flag === null )?'核算后无法进行修改':'归档后无法进行修改'}
            onOk={onOk}
            onCancel={onCancel}
            >
            {(flag === null)?<p className={styles.con}>请确认无误后确认</p>:<p className={styles.con}>请确认无误后归档</p>}
            </Confirm>
        )
    }
}