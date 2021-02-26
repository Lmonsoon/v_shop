import { request } from './request'


export function getorders(obj) {
    return request({
        url: 'orders',
        params: obj
    })
}
export function getkuk() {
    return request({
        url: '/kuaidi/804909574412544580'
    })
}