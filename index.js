const { schedule, attackPromises } = require("./attack")
const { download, downloadAll } = require("./download")
const { serialize } = require("./utils")

async function main([command, ...args], config) {
    try {
        switch (command) {
            case 'config':
                console.log(serialize(config))
                break
            case 'attack':
                await downloadAll()
                schedule()
                const p = [].concat(...Object.values(attackPromises));
                setTimeout(() => console.log(p), 15000)
                break
            case 'download': {
                const name = args[0] || ''
                if (name) {
                    await download(name)
                } else {
                    await downloadAll()
                }
                break
            }
            default:
                throw new Error(`Unknown command ${command}`)

        }
    } catch (err) {
        console.error(err)
    }
}

if (!module.parent) {
    const { items, ...config } = require("./config")
    void main(items, config)
}

module.exports = { main }
