import React, { PureComponent } from 'react';

import classnames from 'classnames';

import styles from './Detail.less';

export default class Avatar extends PureComponent {
  onChange = e => {
    const { onChange } = this.props;
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = e.target.files[0];
      if (/^image\/(jpeg|jpg|gif|bmp|png)/.test(file.type)) {
        if (file.size / 1024 / 1024 < 10) {
          const render = new FileReader();
          render.readAsDataURL(file);
          render.onload = function() {
            onChange(this.result, file.name);
          };
        } else {
          alert('请选择小于10M的文件!');
        }
      } else {
        alert('请选择图片文件!');
      }
    }
  };

  render() {
    const { isView, value, className } = this.props;
    return (
      <div className={classnames(styles.avatarWrapper, {
        [className]: className,
        [styles.editWrapper]: !isView,
      })}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url(${value})`,
          }}
        />
        {!isView && (
          <label
            htmlFor="file1"
            className={classnames(styles.avatarPlaceholder, {
              [styles.hasAvatar]: value,
            })}
          >
            <span className="icon-o-photo" />
            上传头像
            <input
              type="file"
              accept="image/*"
              id="file1"
              className={styles.avatarInput}
              onChange={this.onChange}
            />
          </label>
        )}
      </div>
    );
  }
}
