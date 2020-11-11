import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 分页列表
* @param query 参数
*/
export function listByPage (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/role/page`,
    method: 'POST',
    data: data
  })
}

/**
* 修改
* @param body 参数
*/
export function update (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/role/update`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/api/role/add`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/api/role/${id}`,
    method: 'GET'
  })
}

/**
 * 更新角色状态
 * @param data body 参数
 */
export function updateStatus (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/role/updateStatus`,
    method: 'POST',
    data: data
  })
}
