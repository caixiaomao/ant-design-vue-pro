// 网关前缀
const GATEWAY = '/gateway'

/**
 * 各个子服务前缀定义
 */
export const API_PREFIX = {
  GATEWAY_SERVICE: GATEWAY,
  UPMS_SERVICE: GATEWAY + '/upms_service',
  SYSTEM_SERVICE: GATEWAY + '/system_service'
}
