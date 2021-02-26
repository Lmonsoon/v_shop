import { request } from './request'


export function getcatelist(data) {
    return request({
        url: 'categories',
        params: data
    })
}
export function getcateset(obj) {
    return request({
        url: 'categories',
        method: 'POST',
        data: obj
    })
}
export function getparamslist(id, obj) {
    return request({
        url: `categories/${id}/attributes`,
        params: obj
    })
}
export function getsetdatamo(id, obj) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'POST',
        data: obj
    })
}
export function getedieren(id, _id, obj) {
    return request({
        url: `categories/${id}/attributes/${_id}`,

        params: obj,

    })

}
export function getautorEdieren(id, arrid, obj) {
    return request({
        url: `categories/${id}/attributes/${arrid}`,
        method: 'PUT',
        data: obj
    })
}
export function getremovePe(id, arrid) {
    return request({
        url: `categories/${id}/attributes/${arrid}`,
        method: 'DELETE',
    })

}
export function getGoodsList(obj) {
    return request({
        url: `goods`,
        params: obj
    })
}
export function getremogoli(id) {
    return request({
        url: `goods/${id}`,
        method: 'DELETE'
    })
}
export function getadd(obj) {
    return request({
        url: `goods`,
        method: 'POST',
        data: obj
    })
}