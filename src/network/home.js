import { request } from './request'

export function getMenuList() {
    return request({
        url: '/menus'
    })

}
export function getUserList(queryInfo) {
    // console.log(queryInfo);
    return request({
        url: '/users',
        params: queryInfo
    })
}
export function getuserState(userInfo) {
    return request({
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: 'PUT'
    })
}
export function getsetUser(obj) {
    console.log(obj);
    return request({
        url: '/users',
        method: 'POST',
        data: obj
    })
}
export function getshow(id) {
    return request({
        url: `users/${id}`

    })
}
export function getputid(id, email, mobile) {
    // console.log(email);
    return request({
        url: `users/${id}`,
        method: 'PUT',
        data: {
            mobile,
            email
        }
    })
}
export function getdeleteuser(id) {
    return request({
        url: `users/${id}`,
        method: 'DELETE',
    })
}
export function getsaveda(id, obj) {
    return request({
        url: `users/${id}/role`,
        method: 'PUT',
        data: obj
    })
}