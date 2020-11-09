import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 分页列表
* @param query 参数
*/
export function listByPage (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/role/page`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/role/edit`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/role/add`,
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
    url: `${API_PREFIX.UPMS_SERVICE}/role/${id}`,
    method: 'GET'
  })
}
