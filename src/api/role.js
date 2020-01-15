import request from '@/utils/request'

export function roleList() {
  return request({
    url: '/role',
    method: 'get',
    params: null
  })
}

export function roleListByPage(query) {
  return request({
    url: '/role',
    method: 'get',
    params: query
  })
}

export function getModuleList() {
  return request({
    url: '/role/GetModuleList',
    method: 'get'
  })
}

export function roleAdd(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function roleDel(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
