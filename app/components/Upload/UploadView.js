import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { actions } from 'models/download';
import styles from './Upload.less'



@connect()
class UploadView extends React.Component{

    static propTypes = {
      data: PropTypes.object.isRequired,
    }

    handleDownload = (data) => {
      const { dispatch } = this.props;
      if (data.fileId) {
        actions.DOWNLOAD_FILE_BY_ID(dispatch, { payload: {
          fileId: data.fileId,
          fileName: data.fileName,
        }});
      }
    }

    render(){
      const { data } = this.props;
      return(
        <div className={styles.attachment}>
          <span className={styles.fileIcon}><Icon type="file" /></span>
          <span className={styles.fileName}>{data.fileName}</span>
          <div className={styles.actions}>
            {data.fileId &&
              (
                <div className={styles.actionItem} onClick={() => {this.handleDownload(data)}}>
                  <Icon type="download" />
                </div>
              )
            }
          </div>
        </div>
      )
    }
}
export default UploadView;
