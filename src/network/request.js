import axios from 'axios';

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        // baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
        timers: 5000
    })
    instance.interceptors.request.use(config => {
        //console.log(config);
        config.headers.Authorization = sessionStorage.getItem('token')
        return config
    }, err => {
        console.log(err)
    })
    instance.interceptors.response.use()
        //发送真正的网络请求
    return instance(config)
}