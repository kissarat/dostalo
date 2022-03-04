const config = require('./config');
const httpModule = require('http')
const httpsModule = require('https')
const { URL } = require('url');
const { parsers, readJSON } = require('./utils');
const { isObjectLike } = require('./predicates');
const { pick } = require('rambda');
// const qs = require('querystring');

function handleError(source, reject) {
    source.on('error', function (err) {
        reject(err)
    })
}

const requestOptions = ["agent", "auth", "createConnection", "method", "maxHeaderSize", "timeout"]

function validateRequest(options) {
    const opts = 'string' === typeof options
        ? { url: options }
        : options
    opts.isLocal = '/' === opts.url[0]
    return opts
}

function request(options) {
    return new Promise(function (resolve, reject) {
        const url = new URL(options.url)
        const protocol = url.protocol || config.onlyProtocol
        const http = 'https:' === protocol
            ? httpsModule
            : httpModule
        const httpOptions = pick(requestOptions, options)
        httpOptions.timeout = config.timeout
        if (options.proxy) {
            httpOptions.method = 'CONNECT'
            const parts = options.proxy.ip.split(':')
            httpOptions.host = parts[0]
            httpOptions.port = +parts[1]
            httpOptions.headers['proxy-authorization'] = 'basic ' + Buffer(options.proxy.auth).toString('base64')
        } else {
            httpOptions.host = url.host
            httpOptions.port = 443
            httpOptions.headers = httpOptions.headers && config.requestHeaders
                ? Object.assign(httpOptions.headers, config.requestHeaders)
                : (config.requestHeaders || {})
        }
        // if (isObjectLike(options.query)) {
        //     url.search = '?' + qs.stringify(options.query)
        // }
        const urlString = url.toString()
        // console.log(urlString, httpOptions)
        const req = http.request(httpOptions, function (res) {
            console.log(res.statusCode, urlString, httpOptions)
            handleError(res, reject)
            const chunks = []
            const parse = parsers[options.parser]
            if (parse) {
                res.on('data', function (chunk) {
                    chunks.push(chunk)
                })
            }
            res.on('end', function () {
                res.raw = null
                res.data = null
                res.contentType = res.headers['content-type'] || ''
                if (parse) {
                    res.raw = Buffer.concat(chunks)
                    res.data = parse(res.raw.toString(config.encoding))
                }
                resolve(res)
            })
        })
        handleError(req, reject)
        // req.on('socket', function(socket) {
        //     socket.setTimeout(config.timeout)
        // })
        req.end()
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
    validateRequest
}
