import store from 'store'
import expire from 'store/plugins/expire'

store.addPlugin(expire)

// 当前时间的毫秒值
const now = new Date().getTime()

/**
 * 缓存并在指定时间（毫秒）内失效
 * @param key 缓存key
 * @param value 缓存值
 * @param expireTime 过期时间，单位毫秒
 */
const expireInMillisecond = function (key, value, expireTime) {
  store.set(key, value, now + expireTime)
}

/**
 * 缓存并在指定时间（秒）内失效
 * @param key 缓存key
 * @param value 缓存值
 * @param expireTime 过期时间，单位秒
 */
const expireInSecond = function (key, value, expireTime) {
  store.set(key, value, now + expireTime * 1000)
}

export default store

export {
  expireInMillisecond,
  expireInSecond,
  store as storage
}
