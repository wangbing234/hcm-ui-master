import request from '../utils/request';

export default class BaseService {
  constructor(options) {
    this.defaultOptions = options || this.defaultOptions;
  }

  defaultOptions = {
    credentials: 'include',
  };

  request(url, options) {
    return request(url, Object.assign({}, this.defaultOptions, options));
  }
}
