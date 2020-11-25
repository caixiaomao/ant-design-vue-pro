import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 修改
* @param body 参数
*/
export function token (data, params) {
  return axios({
    url: `${API_PREFIX.AUTH_SERVICE}/oauth/token`,
    method: 'POST',
    data: data,
    params: params
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
