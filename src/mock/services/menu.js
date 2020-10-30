import Mock from 'mockjs2'
import { getQueryParameters, randomRange, commonBuilder } from '../util'

const menuList = (options) => {
  // eslint-disable-next-line no-unused-vars
  const queryParameters = getQueryParameters(options)
  // console.log('queryParameters', queryParameters)
  const paramsBody = options.body
  let pageSize = 10
  let pageNum = 1
  if (paramsBody) {
    const _paramsBody = JSON.parse(paramsBody)
    if (_paramsBody.pageSize) {
      pageSize = _paramsBody.pageSize
    }
    if (_paramsBody.pageNum) {
      pageNum = _paramsBody.pageNum
    }
  }
  const list = []
  const randomDataCount = randomRange(1, pageSize)
  for (let i = 0; i < randomDataCount; i++) {
    const obj = {
      'id': Mock.mock('@increment(0)'),
      'parentId': null,
      'title': Mock.mock('@cword(2, 5)'),
      'name': Mock.mock('@string("upper", 5)'),
      'icon': Mock.mock('@color'),
      'path': Mock.mock('@url'),
      'redirect': Mock.mock('@url'),
      'component': Mock.mock('@name(5)'),
      'hidden': Mock.mock('@integer(0, 1)'),
      'hideChildren': Mock.mock('@integer(0, 1)'),
      'keepAlive': Mock.mock('@integer(0, 1)'),
      'sort': Mock.mock('@integer(0, 1)'),
      'description': Mock.mock('@cparagraph(1, 3)'),
      'status': Mock.mock('@integer(0, 1)'),
      'createTime': Mock.mock('@now()'),
      'updateTime': Mock.mock('@now()')
    }
    list.push(obj)
  }
  const page = {
    total: Mock.mock('@integer(1, 200)'),
    pageNum: pageNum,
    pageSize: pageSize,
    list: []
  }
  page.list = list
  return commonBuilder(page)
}

Mock.mock(/\/mock\/api\/menu\/page/, 'post', menuList)
