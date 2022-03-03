const config = require('./config');
const httpModule = require('http')
const httpsModule = require('https')
const { URL } = require('url')

function request(urlString, options = {}) {
    return new Promise(function (resolve, reject) {
        const url = new URL(urlString)
        const headers = options.headers || {}
        const http = 'https:' === url.protocol
            ? httpsModule
            : httpModule
        Object.assign(options, pick([], url))
        http.request(url, function (res) {
            const chunks = []
            const collectResponse = 'string' === typeof options.headers.accept
            if (collectResponse) {
                res.on('data', function (chunk) {
                    chunks.push(chunk)
                })
            }
            res.on('end', function () {
                if (collectResponse) {
                    res.data = Buffer.concat(chunks)
                }
                resove(res)
            })
        })
    })

}
