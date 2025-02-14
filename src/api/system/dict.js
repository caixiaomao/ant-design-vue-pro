import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 分页列表
* @param query 参数
*/
export function listByPage (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/page`,
    method: 'POST',
    data: data
  })
}

/**
* 修改
* @param body 参数
*/
export function edit (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/update`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/add`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/delete/${id}`,
    method: 'GET'
  })
}

/**
 * 修改状态
 * @param data body参数
 */
export function updateStatus (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/updateStatus`,
    method: 'POST',
    data: data
  })
}
