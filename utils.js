const { readFileSync } = require("fs")

function readJSON(filename) {
    return JSON.parse(readFileSync(filename))
}

module.exports = { readJSON }
