const { readFileSync } = require("fs");
const { basename } = require("path");

function readJSON(filename) {
    return JSON.parse(readFileSync(filename))
}

function serialize(obj) {
    return JSON.stringify(obj, null, '  ')
}

const parsers = {
    json: str => JSON.parse(str)
}

function getProcessArguments(args = process.argv) {
    // const nodeIndex = isElectronNode ? 0 : args.map(a => basename(a)).indexOf('node');
    const nodeIndex = args.map(a => basename(a)).indexOf('node');
    if (nodeIndex < 0) {
        throw new Error(`Program node not found at "${args.join(' ')}"`)
    }
    return args.slice(nodeIndex + 2);
}

async function* generate(promise) {
    let data
    while (data = await promise) {
        yield data
    }
}

function getOptions(args = process.argv, options = {}) {
    const ordered = [];
    for (const arg of getProcessArguments(args, options)) {
        if (arg.indexOf("--") === 0) {
            const p = arg.split("=");
            options[p[0].slice(2)] = 2 === p.length ? p[1] : true;
        } else {
            ordered.push(arg);
        }
    }
    return [options, ...ordered];
}

function collect(input) {
    const chunks = []
    input.on('data', function (chunk) {
        chunks.push(chunk)
    })
    input.on('end', function () {
        resolve(Buffer.concat(chunks))
    })
}

module.exports = { readJSON, getProcessArguments, getOptions, serialize, collect, parsers }
