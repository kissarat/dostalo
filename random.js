
function randomInt(max) {
    return Math.round(Math.random() * max)
}

function randomItem(items) {
    return items[randomInt(items.length - 1)]
}

function randomChar(items) {
    return items.charAt(randomInt(items.length - 1))
}

function *randomGenerator(alphabet, max = 1) {
    for(let i = 0; i < max; i++) {
        yield randomChar(alphabet)
    }
}

function randomString(alphabet, max = 1) {
    return Array.from(randomGenerator(alphabet, max)).join('')
}

module.exports = { randomString, randomInt }
