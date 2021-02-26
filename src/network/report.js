import { request } from './request'

export function getre() {
    return request({
        url: 'reports/type/1'
    })

}