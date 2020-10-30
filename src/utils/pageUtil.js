/**
 * 格式化分页参数
 * @param params
 * @returns {{}}
 */
export function formatPageParams (params) {
  const pageParams = {}
  if (params === null || params === undefined) {
    return pageParams
  }
  if (params.sortOrder === 'ascend') {
    pageParams.sortOrder = 'asc'
  }
  if (params.sortOrder === 'descend') {
    pageParams.sortOrder = 'desc'
  }
  if (params.sortField === 'createTime') {
    pageParams.sortField = 'create_time'
  }
  return pageParams
}
