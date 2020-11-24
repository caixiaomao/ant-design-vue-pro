import { axios } from '@/utils/request'
import { API_PREFIX } from '@/config/system'

/**
* 菜单分页列表
* @param query 参数
*/
export function listByPage (data) {
  // todo mock接口 后续需要移除
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/page`,
    method: 'POST',
    data: data
  })
}

/**
 * 菜单分页列表
 * @param query 参数
 */
export function listByTreePage (data) {
  // todo mock接口 后续需要移除
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/pageTree`,
    method: 'POST',
    data: data
  })
}

/**
* 修改菜单
* @param data
*/
export function update (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/update`,
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

/**
 * 修改菜单状态
 * @param body 参数
 */
export function updateStatus (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/updateStatus`,
    method: 'POST',
    data: data
  })
}

/**
 * 菜单树列表
 * @param body 参数
 */
export function listTree (data) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/listTree`,
    method: 'POST',
    data: data
  })
}

/**
 * 根据角色id查询角色菜单
 * @param roleId 角色id
 */
export function listMenusByRoleId (roleId) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/listMenusByRoleId/${roleId}`,
    method: 'GET'
  })
}

/**
 * 根据菜单id查询菜单
 * @param id
 * @returns {AxiosPromise}
 */
export function getMenuById (id) {
  return axios({
    url: `${API_PREFIX.UPMS_SERVICE}/api/menu/${id}`,
    method: 'GET'
  })
}
