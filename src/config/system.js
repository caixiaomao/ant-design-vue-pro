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
  SYSTEM_SERVICE: process.env.NODE_ENV === 'mock' ? GATEWAY : GATEWAY + '/system_service'
}
