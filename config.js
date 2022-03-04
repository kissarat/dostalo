const { join } = require('path')
const { tmpdir } = require('os')
const { readJSON, getOptions } = require('./utils')
const { omit, pick } = require('rambda');
const { applyPatch } = require('fast-json-patch');

const config = readJSON(join(__dirname, 'default-config.json'));
const currentdir = process.cwd()

const [options, ...items] = getOptions(process.argv)

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
config.items = items
Object.assign(config, pick(['targets', 'proxies', 'tmpdir', 'logfile'], options))

const pkg = readJSON(join(__dirname, 'package.json'))
Object.assign(config, pick(['version', 'engines'], pkg))

if ('string' !== typeof config.tmpdir) {
    config.tmpdir = tmpdir()
}

module.exports = config

function patch(changes) {
    module.exports = applyPatch(module.exports, changes).newDocument
    module.exports.patch = patch
}

module.exports.patch = patch
