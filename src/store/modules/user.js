// import storage from 'store'
/* eslint-disable no-unused-vars,camelcase */
import { storage, expireInSecond } from '@/utils/storageUtil'
import { login, getInfo, logout } from '@/api/login'
import { token } from '@/api/system/login'
import { ACCESS_TOKEN, TOKEN_INFO, USER_INFO } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { getUserById } from '@/api/system/user'
import notification from 'ant-design-vue/es/notification'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      // state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // todo 注释原始登录
        /* login(userInfo).then(response => {
          const result = response.result
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        }) */
        token(userInfo).then(data => {
          console.log('login params', userInfo)
          console.log('token', data)
          if (data) {
            const { access_token, expires_in, user_id, username } = data
            storage.set(TOKEN_INFO, data)
            // todo 提前5分钟失效
            // storage.set(ACCESS_TOKEN, access_token, (expires_in - 30) * 1000)
            expireInSecond(ACCESS_TOKEN, access_token, expires_in - 30)
            commit('SET_TOKEN', access_token)
            resolve()
          } else {
            reject(new Error('获取token失败'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // todo 屏蔽获取用户信息
        /* getInfo().then(response => {
          const result = response.result

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        }) */
        const tokenInfo = storage.get(TOKEN_INFO)
        // 获取用户信息
        if (tokenInfo) {
          getUserById(tokenInfo.user_id).then(res => {
            console.log('获取用户信息', res)
            const { status, message, data } = res
            if (status === 1) {
              storage.set(USER_INFO, data)
              commit('SET_NAME', { name: data.name })
              commit('SET_AVATAR', data.avatar)
              commit('SET_ROLES', [])
              commit('SET_USER_INFO', data)
              resolve(data)
            } else {
              notification.error({
                message: '错误',
                description: message || '获取用户信息失败'
              })
            }
          }).catch(err => {
            console.error(err)
            reject(err)
          })
        }
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER_INFO', null)
          storage.remove(ACCESS_TOKEN)
          storage.remove(TOKEN_INFO)
          storage.remove(USER_INFO)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
