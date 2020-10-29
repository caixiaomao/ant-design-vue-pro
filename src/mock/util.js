const responseBody = {
  message: '',
  timestamp: 0,
  result: null,
  code: 0
}

export const builder = (data, message, code = 0, headers = {}) => {
  responseBody.result = data
  if (message !== undefined && message !== null) {
    responseBody.message = message
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
    responseBody._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  return responseBody
}

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}

// todo mock返回结果
const commonResponseBody = {
  message: '操作成功',
  timestamp: 0,
  data: null,
  status: 1
}

export const commonBuilder = (data, message, status = 1, headers = {}) => {
  commonResponseBody.data = data
  if (message !== undefined && message !== null) {
    commonResponseBody.message = message
  }
  if (status !== undefined && status !== 0) {
    commonResponseBody.status = status
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    commonResponseBody._headers = headers
  }
  commonResponseBody.timestamp = new Date().getTime()
  return commonResponseBody
}

// 生成指定区间随机数
export function randomRange (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
