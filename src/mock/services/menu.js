import Mock from 'mockjs2'
import { getQueryParameters, randomRange, commonBuilder } from '../util'

const menuList = (options) => {
  const queryParameters = getQueryParameters(options)
  console.log('queryParameters', queryParameters)
  const total = randomRange(5, 50)
  const list = []
  for (let i = 0; i < total; i++) {
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
    total: total,
    pageNum: 1,
    pageSize: 10,
    list: []
  }
  page.list = list
  return commonBuilder(page)
}

Mock.mock(/\/mock\/api\/menu\/page/, 'post', menuList)
