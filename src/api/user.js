import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 分页列表
* @param query 参数
*/
export function listByPage (data, params) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/user/page`,
    method: 'POST',
    data: data,
    params: params
  })
}

/**
* 修改
* @param body 参数
*/
export function edit (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/user/update`,
    method: 'POST',
    data: data
  })
}

/**
* 添加
* @param body 参数
*/
export function add (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/user/add`,
    method: 'POST',
    data: data
  })
}

/**
* 根据id删除
* @param 唯一 id
*/
export function deleteById (id) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/user/delete/${id}`,
    method: 'GET'
  })
}

/**
* 修改状态
* @param data body参数
*/
export function updateStatus (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/user/updateStatus`,
    method: 'POST',
    data: data
  })
}

/**
 * 重置密码
 * @param id
 * @returns {AxiosPromise}
 */
export function resetPassword (id) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/user/resetPassword/${id}`,
    method: 'GET'
  })
}
