// 完整参数参考 https://github.com/react-component/upload

import React, { Component } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FileUpload from 'rc-upload';
import { message } from 'antd';
import styles from "./Upload.less";

const kb2mb = (kb) => {
	return parseInt(kb / 1024 / 1000, 10);
}

const mb2kb = (mb) => {
	return parseInt(1024 * 1000 * mb, 10);
}

class Upload extends Component {

	static propTypes = {
    action: PropTypes.any, // 上传 url
    prefixCls: PropTypes.string,
    showList: PropTypes.bool, // 是否显示上传列表
		maxSize: PropTypes.number, // 文件上限大小, 默认10M
		maxFile: PropTypes.number, // 最大上传个数
		defaultValue: PropTypes.array, // 默认文件
		onChange: PropTypes.func, // 文件变化回调函数
  };

  static defaultProps = {
		action: 'http://localhost:8765/api/upload/',
    prefixCls: 'hcm-upload',
    showList: true,
		maxSize: mb2kb(10),
		maxFile: 1,
		defaultValue: [],
		onChange: () => {},
	}

	state = {
    uploading: false, // 上传状态
    uploadedFiles: this.props.defaultValue, // 已经上传的文件列表
  };

	onBeforeUpload = (file, fileList) => {
		const { uploadedFiles } = this.state;
		const { maxSize, maxFile } = this.props;
		const { size } = file;
		// 检查文件数量
		if (fileList.length + uploadedFiles.length > maxFile) {
			return false;
		}
		// 检查文件体积
		if (size > maxSize) {
			message.error(`文件大小不能大于${kb2mb(maxSize)}M`);
			return false;
		}
	}

	onStart = () => {
		this.setState({ uploading: true });
	}

	onSuccess = (file) => {
		const { uploadedFiles } = this.state;
		const { onChange } = this.props;
		uploadedFiles.push(file);
		this.setState({
			uploadedFiles: [...uploadedFiles],
			uploading: false,
		});
		onChange(uploadedFiles);
	}

	onError = (err) => {
    window.console.error('文件上传错误：', err);
    this.setState({ uploading: false });
	}

	// 下载文件
	handleDownload = (file) => {
		window.console.log(file);
	}

	// 删除文件
	handleDelete = (file) => {
		const { uploadedFiles } = this.state;
		const { onChange } = this.props;
		const { fileId } = file;
		const index = uploadedFiles.findIndex(_file => {
			return _file.fileId === fileId;
		});
		uploadedFiles.splice(index, 1);
		this.setState({
			uploadedFiles: [...uploadedFiles],
		});
		onChange(uploadedFiles);
	}

	uploadCallbacks = {
		beforeUpload: this.onBeforeUpload,
		onStart: this.onStart,
		onProgress: this.onProgress,
		onSuccess: this.onSuccess,
		onError: this.onError,
	}

  render() {
		const { uploadedFiles } = this.state;
    const { maxFile, children, showList, ...props } = this.props;
    return (
			<div>
				{ (uploadedFiles.length > 0 && showList) &&
					uploadedFiles.map(file => {
						return (
							<div key={file.fileId} className={classNames(styles.file, props.className)}>
								<span className={styles.fileIcon}><i className="icon-o-file" /></span>
								{file.filename}
								<div className={styles.actions}>
									<span
										className={styles.actionIcon}
										onClick={() => {this.handleDownload(file)}}
									>
                    <i className="icon-download" />
									</span>
									<span
										className={styles.actionIcon}
										onClick={() => {this.handleDelete(file)}}
									>
										<i className="icon-o-trash" />
									</span>
								</div>
							</div>
						)
					})
				}
        {
					(uploadedFiles.length < maxFile) && (
            <FileUpload
              {...props}
              {...this.uploadCallbacks}
            >
              {
                typeof children === 'function' ? children(this.state) : children
              }
            </FileUpload>
          )}
      </div>
    );
  }
}

export default Upload;
