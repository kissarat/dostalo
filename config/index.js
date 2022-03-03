const { dirname, join } = require('path')
const { tmpdir } = require('os')
const { readJSON } = require('../utils')

const configdir = __dirname

function readConfig(name) {
    return readJSON(join(configdir, `${name}.json`))
}

const config = readConfig('default');

try {
    const local = readConfig('local')
    Object.assign(config, local)
} catch (err) {
    console.warn("No local configuratin")
}

config.configdir = configdir
config.basedir = dirname(config.configdir)

if ('string' !== typeof config.tmpdir) {
    config.tmpdir = tmpdir()
}

module.exports = config
