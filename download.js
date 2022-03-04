const config = require('./config');
const { request } = require('./http');
const { URL } = require('url');
const { readJSON, writeJSON } = require('./utils');
const pkg = require('./package.json');
const { join } = require('path');

async function download(name) {
    const listURL = config[`${name}URL`]
    const now = new Date()
    const filename = join(config.tmpdir, `${pkg.name}-${name}.json`)
    const content = readJSON(filename)
    if (content) {
        const obtainedAt = new Date(content.obtainedAt)
        if (now.getTime() - obtainedAt.getTime() <= config.downloadMaxAge * 1000) {
            config[name] = content.data
            return
        }
    }
    // console.log(listURL)
    console.log(`Download ${name}`)
    const res = await request({
        url: listURL,
        parser: 'json'
    })
    let i = 0
    switch(name) {
        case 'targets': {
            const dictionary = {}
            for(const site of res.data) {
                const url = new URL(site.page)
                // console.log(config.onlyProtocol, url.protocol)
                if (config.onlyProtocol === url.protocol) {
                    dictionary[url.host] = {
                        host: url.host,
                        n: i + 1
                    }
                    i++
                }
            }
            config[name] = dictionary
            break
        }
        case 'proxies':
            config[name] = res.data
            break
    }
    writeJSON(filename, {
        obtainedAt: now.toISOString(),
        data: config[name]
    })
}

async function downloadAll() {
    if (!config.sites) {
        await download('targets')    
    }
    if (!config.proxies) {
        await download('proxies')  
    }
}

module.exports = { downloadAll, download }
