import { request } from './request'

export function getLogindata(username, password) {
    return request({
        url: '/login',
        method: 'POST',
        params: {
            username,
            password
        }
    })
}