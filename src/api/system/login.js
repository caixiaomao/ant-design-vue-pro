import { axios } from '@/utils/request'
import { API_PREFIX, LOGIN_CONFIG } from '@/config/system'

/**
* 修改
* @param body 参数
*/
export function token (params) {
  // 登录方式，默认为密码登录
  if (params[LOGIN_CONFIG.GRANT_TYPE_MOBILE]) {
    params.grant_type = LOGIN_CONFIG.GRANT_TYPE_MOBILE
  } else {
    params.grant_type = LOGIN_CONFIG.GRANT_TYPE_PASSWORD
  }
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/oauth/token`,
    method: 'GET',
    params: params,
    headers: {
      'Authorization': 'Basic ' + window.btoa(LOGIN_CONFIG.CLIENT_ID + ':' + LOGIN_CONFIG.CLIENT_SECRET)
    }
  })
}

/**
 * 获取验证码
 * @param type
 * @returns {AxiosPromise}
 */
export function validateCode (type) {
  // todo 支持多种验证码
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/api/validate/code/image`,
    method: 'GET'
  })
}

/**
 * 获取短信验证码
 * @param type
 * @returns {AxiosPromise}
 */
export function smsCode (params) {
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/api/validate/code/sms`,
    method: 'GET',
    params: params
  })
}

/**
 * 在线用户列表
 * @param data
 * @returns {AxiosPromise}
 */
export function onlineUsers (data) {
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/api/auth/onlineUsers`,
    method: 'POST',
    data: data
  })
}

/**
 * 强制下线
 * @param params
 * @returns {AxiosPromise}
 */
export function forceLogout (params) {
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/api/auth/forceLogout`,
    method: 'GET',
    params: params
  })
}
