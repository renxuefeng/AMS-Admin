import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/User/GetUserInfo',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function userList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function userAdd(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function userDel(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}
