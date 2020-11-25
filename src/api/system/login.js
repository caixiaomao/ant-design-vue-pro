import { axios } from '@/utils/request'
import { API_PREFIX, LOGIN_CONFIG } from '@/config/system'

/**
* 修改
* @param body 参数
*/
export function token (params) {
  params.grant_type = LOGIN_CONFIG.GRANT_TYPE
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/oauth/token`,
    method: 'POST',
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
