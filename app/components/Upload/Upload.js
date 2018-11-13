import React from 'react';
import PropTypes from 'prop-types';
import { Icon, message } from 'antd';
import { removeDataBase64 } from 'utils/utils';
import styles from './Upload.less'


class Upload extends React.Component{

    static propTypes = {
      text: PropTypes.string, // 上传按钮文本
      max: PropTypes.number, // 文件上限
      defautValue: PropTypes.object, // 默认值
    }

    static defaultProps = {
      text: '+ 添加附件',
      max: 1024 * 1000 * 10, // 10M
      defautValue: {},
    }

    state = {
      fileName: this.props.defautValue.fileName || null,
    }

    // 删除文件
    handleDelete = () => {
      const { onChange } = this.props;
      this.setState({
        fileName: null,
      });
      onChange();
    }

    // 选择文件后预览
    handlePreview = (data) => {
      this.setState({
        fileName: data.fileName,
      })
    }

    // 选择文件
    handleChange = (e) => {
      const { onChange, max } = this.props;
      const { files } = e.target;
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (() => {
        const fileName = file.name;
        const fileSize = file.size;
        if (fileSize <= max) {
          return event => {
            const { result } = event.target;
            const data = {
              fileName,
              data: removeDataBase64(result),
            };
            this.handlePreview(data);
            onChange(data);
          };
        } else {
          message.error(`附件大小不能大于${max / 1000 / 1024}MB`);
        }
      })();
      reader.readAsDataURL(file);
      e.target.value = '';
    }

    render(){
        const { fileName } = this.state;
        const { text } = this.props;

        return(
          fileName ? (
            <div className={styles.attachment}>
              <span className={styles.fileIcon}><Icon type="file" /></span>
              <span className={styles.fileName}>{fileName}</span>
              <div className={styles.actions}>
                <div className={styles.actionItem} onClick={() => this.handleDelete()}>
                  <Icon type="delete" />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.upload}>
              <span>{text}</span>
              <input
                onChange={(e) => {this.handleChange(e)}}
                type="file"
                className={styles.input}
              />
            </div>
          )
        )
    }
}
export default Upload;
