import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 菜单分页列表
* @param query 参数
*/
export function listByPage (data) {
  return axios({
    url: `/mock/api/menu/page`,
    method: 'POST',
    data: data
  })
}

/**
* 修改菜单
* @param data
*/
export function edit (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/edit`,
    method: 'POST',
    data: data
  })
}

/**
* 添加菜单
* @param body 参数
*/
export function add (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/add`,
    method: 'POST',
    data: data
  })
}

/**
* 根据 id 删除菜单
* @param id 菜单id
*/
export function deleteById (id) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/delete/${id}`,
    method: 'GET'
  })
}
