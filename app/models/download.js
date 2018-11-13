import { Actions, createActions } from 'utils/actionUtil';
import { createModels } from 'utils/modelUtil';
import DownloadService from 'services/download';

const downloadService = new DownloadService();

const NAMESPACE = 'download';

export const ACTION_NAMES = new Actions({
  DOWNLOAD_FILE_BY_ID: null,
});

export const actions = createActions(ACTION_NAMES, NAMESPACE);

const { effects, reducers } = createModels({
  // 下载文件
  [ACTION_NAMES.DOWNLOAD_FILE_BY_ID]: {
    servers: downloadService.downloadFile.bind(downloadService),
  },
});



export default {
  namespace: NAMESPACE,

  state: {

  },

  effects: {
    ...effects,
  },

  reducers: {
    ...reducers,
  },
};
