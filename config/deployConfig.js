const ossAccessConfig = {
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIzcRCWfoMwSxw',
  accessKeySecret: 'WKojyrL3UX8LbpTA9smdKyIbjaPQvz',
}

module.exports = {
  mock: {
    host: 'http://localhost:8765',
  },
  dev: {
    host: 'http://dev-api.hcm.youzhao.io',
    ossConfig: {
      ...ossAccessConfig,
      bucket: 'hcm-ui-dev',
    },
  },
  uat: {
    host: 'http://uat-api.hcm.youzhao.io',
    ossConfig: {
      ...ossAccessConfig,
      bucket: 'hcm-ui-uat',
    },
  },
  prod: {
    host: '',
    ossConfig: {
      ...ossAccessConfig,
      bucket: 'hcm-ui-prod',
    },
  },
  local: {
    host: 'http://localhost:8080',
    ossConfig: {
      ...ossAccessConfig,
      bucket: 'hcm-ui-local',
    },
  },
}
