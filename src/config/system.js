// 网关前缀
let GATEWAY = ''
if (process.env.NODE_ENV === 'mock') {
  GATEWAY = '/mock'
} else {
  GATEWAY = '/gateway'
}

/**
 * 各个子服务前缀定义
 */
export const API_PREFIX = {
  GATEWAY_SERVICE: GATEWAY,
  UPMS_SERVICE: process.env.NODE_ENV === 'mock' ? GATEWAY : GATEWAY + '/upms_service',
  AUTH_SERVICE: process.env.NODE_ENV === 'mock' ? GATEWAY : GATEWAY + '/auth_service'
}

/**
 * 登录相关配置
 * @type {{CLIENT_SECRET: string, CLIENT_ID: string, GRANT_TYPE: string}}
 */
export const LOGIN_CONFIG = {
  CLIENT_ID: 'admin_app',
  CLIENT_SECRET: '21232f297a57a5a743894a0e4a801fc3',
  GRANT_TYPE_PASSWORD: 'password',
  GRANT_TYPE_MOBILE: 'mobile'
}
