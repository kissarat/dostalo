const { readFileSync } = require("fs");
const { basename } = require("path");

function readJSON(filename) {
    return JSON.parse(readFileSync(filename))
}

function getProcessArguments(args = process.argv) {
    // const nodeIndex = isElectronNode ? 0 : args.map(a => basename(a)).indexOf('node');
    const nodeIndex = args.map(a => basename(a)).indexOf('node');
    if (nodeIndex < 0) {
        throw new Error(`Program node not found at "${args.join(' ')}"`)
    }
    return args.slice(nodeIndex + 2);
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

module.exports = { readJSON, getProcessArguments, getOptions }
