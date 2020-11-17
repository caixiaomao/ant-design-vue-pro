import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 分页列表
* @param query 参数
*/
export function listItemByPage (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/item/page`,
    method: 'POST',
    data: data
  })
}

/**
* 修改
* @param body 参数
*/
export function editItem (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/item/update`,
    method: 'POST',
    data: data
  })
}

/**
* 添加
* @param body 参数
*/
export function addItem (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/item/add`,
    method: 'POST',
    data: data
  })
}

/**
* 根据id删除
* @param 唯一 id
*/
export function deleteItemById (id) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/item/delete/${id}`,
    method: 'GET'
  })
}

/**
 * 修改状态
 * @param data body参数
 */
export function updateItemStatus (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/dict/item/updateStatus`,
    method: 'POST',
    data: data
  })
}
