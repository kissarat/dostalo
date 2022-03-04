const config = require('./config');
const httpModule = require('http')
const httpsModule = require('https')
const { URL } = require('url');
const { parsers, readJSON } = require('./utils');

function headleError(source, reject) {
    source.on('error', function (err) {
        reject(err)
    })
}

const requestOptions = ["agent", "auth", "createConnection", "method", "maxHeaderSize"]

function validateRequestTask(options) {
    const opts = 'string' === typeof options
        ? { url: options }
        : options
    opts.isLocal = '/' === opts.url[0]
    return opts
}

function request(options) {
    return new Promise(function (resolve, reject) {
        const url = new URL(options.url)
        const http = 'https:' === url.protocol
            ? httpsModule
            : httpModule
        const httpOptions = pick(requestOptions, options)
        httpOptions.headers = httpOptions.headers && config.requestHeaders
            ? Object.assign(httpOptions.headers, config.requestHeaders)
            : (config.requestHeaders || {})
        const req = http.request(url.toString(), httpOptions, function (res) {
            const chunks = []
            const collectResponse = 'string' === typeof options.headers.accept
            if (collectResponse) {
                res.on('data', function (chunk) {
                    chunks.push(chunk)
                })
            }
            res.on('end', function () {
                res.raw = null
                res.data = null
                res.contentType = res.headers['content-type'] || ''
                if (collectResponse) {
                    res.raw = Buffer.concat(chunks)
                    const parse = parsers[options.parser]
                    if ('function' === parse) {
                        res.data = parse(res.raw.toString(config.encoding))
                    }
                }
                resolve(res)
            })
        })
        headleError(req, reject)
    })
}

function requestJSON(options) {
    if (options.isLocal) {
        return readJSON(options.url)
    }
    return request(options)
}

module.exports = {
    request,
    requestJSON,
    validateRequestTask
}
