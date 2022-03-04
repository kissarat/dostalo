const { createReadStream } = require('fs')
const { createServer } = require('http')
const { v4: uuid } = require('uuid')
const { serialize } = require('v8')
const { tasks } = require('./storage')
const config = require('./config')
const { collect, parsers } = require('./utils')

function listen(url) {
    const stream = url
        ? createReadStream(url)
        : process.stdout
    return stream
}

function sendJSON(status, res, data) {
    res.statusCode = status
    if (data && data !== true) {
        const { id, ...result } = data
        res.setHeader('id', id)
        res.setHeader('content-type', 'application/json')
        res.end(serialize(result))
    } else {
        res.end()
    }
}

function collectJSON(req) {
    req.data = await parsers.json((await collect(req)).toString('utf-8'))
}

async function serve(options, next) {
    const server = createServer(async function (req, res) {
        try {
            const id = req.url.slice(1) || uuid()
            let result
            switch (req.method) {
                case 'GET':
                    result = config
                    break
                case 'POST': {
                    await collectJSON(req)
                    config.patch(req.data)
                    result = { ...req.data }
                    break
                }
            }
            if (result) {
                result.id = id
            }
            sendJSON(200, res, { ok: 1 })
            const result = await next(data)
            
        } catch (err) {
            console.error(err)
        }
    })
    return new Promise(function (resolve, reject) {
        server.on('error', (err) => reject(err))
        server.listen(options, () => resolve(server))
    })
}

function pipe(input, output, convert) {
    input.on('data', async function (chunk) {
        try {
            output.write(await convert(chunk))
        } catch (err) {
            console.error(err)
        }
    })
    input.on('close', function () {

    })
}
