import BaseService from './BaseService';

export default class GlobalService extends BaseService {
  // 下载文件
  downloadFile(payload) {
    const {fileId, fileName} = payload;
    return this.request(`/api/file/download/${fileId}`, {
      type: 'DOWNLOAD',
      fileName,
    });
  }
}
