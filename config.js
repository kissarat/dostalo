const { join } = require('path')
const { tmpdir } = require('os')
const { readJSON, getOptions } = require('./utils')
const { omit, pick } = require('rambda')

const config = readJSON(join(__dirname, 'default-config.json'));
const currentdir = process.cwd()

const [options, command] = getOptions(process.argv)

try {
    const headers = config.headers
    const local = readJSON(options.config || join(currentdir, 'local-config.json'))
    Object.assign(config, omit(["headers"], local))
    if (local.headers) {
        config.headers = Object.assign(headers, local.headers)
    }
} catch (err) {
    console.warn("No local configuration")
}

config.basedir = __dirname
config.currentdir = currentdir
config.command = command
Object.assign(config, pick(['targets', 'proxies', 'tmpdir'], options))

if ('string' !== typeof config.tmpdir) {
    config.tmpdir = tmpdir()
}

module.exports = config
