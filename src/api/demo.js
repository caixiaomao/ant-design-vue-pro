import { axios } from '@/utils/request'

/**
* 分页列表
* @param query 参数
*/
export function listByPage (data, params) {
  return axios({
    url: `/demo/listByPage`,
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
    url: `/demo/edit`,
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
    url: `/demo/add`,
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
    url: `/demo/${id}`,
    method: 'GET'
  })
}
