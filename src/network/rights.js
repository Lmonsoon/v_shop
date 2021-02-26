import { request } from './request'

export function getrightsList(type) {
    return request({
        url: `rights/${type}`
    })
}
export function getrolestabbr() {
    return request({
        url: `roles`
    })
}
export function getdeletecon(role, rightId) {
    return request({
        url: `roles/${role.id}/rights/${rightId}`,
        method: 'delete'
    })
}
export function getdeleteuser(id) {
    return request({
        url: `roles/${id}`,
        method: 'delete'
    })
}
export function getsetallot(roleId, obj) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'POST',
        data: obj
    })
}