import {
  SET_SYSINFO,
  SET_BASEURL,
  SET_TOKEN
} from '../mutationTypes'

const state = {
  // 保存第一页数据
  //baseUrl: 'http://68.61.8.125/szga/',
  baseUrl: 'http://172.29.3.76:9219/szga/',
  accessToken: '',
  applyID:'f2bc84811d084b2d830f75a78505a60f',
  secretKey:'928F7855D87F443B410A01D30169E7F3'
}

const mutations = {
  // 设置 token 登录名 头像
  [SET_SYSINFO] (state, data) {
    try {
      state.baseUrl = data.baseUrl
      state.accessToken = data.accessToken
    } catch (err) {
      console.log(err)
    }
  },
  [SET_BASEURL] (state, url) {
    state.baseUrl = url
  },
  [SET_TOKEN] (state, token) {
    state.accessToken = token
  }
}

const actions = {
}

const getters = {
  GetterBaseUrl: state => {
    return state.baseUrl
  },
  GetterAccessToken: state => {
    return state.accessToken
  },
  GetterSysInfo: state => {
    return state
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
