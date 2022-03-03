const { join } = require("path")
const config = require("./config")
const { readJSON, serialize } = require("./utils")

const pkg = readJSON(join(__dirname, 'package.json'))

switch (config.command) {
    default: {
        console.log(`Нас DoStalo ${pkg.version}!`)
        console.log(serialize(config))
    }
    break
}
