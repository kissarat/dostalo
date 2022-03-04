const { requestJSON, validateRequestTask } = require("./http")
const { serialize } = require("./utils")

const modes = {
    sequence: {
        description: 'Run as sequence',
        async handle(items, options, context) {
            for(const item of items) {
                await item.handle(options, context)
            }
        }
    },
    parallel: {
        description: 'Run in parralel',
        async handle(items, options, context) {
            return Promise.all(items.map(item => item.handle(options, context)))
        }
    }
}

const actions = {
    include: {
        description: 'Include JSON file',
        schema: {
            type: 'string',
            format: 'uri'
        },
        validate: validateRequestTask,
        async handle(options, context) {
            const json = await requestJSON(options)
            context[options.id] = json
        }
    },
    config: {
        description: 'Read config file',
        async handle(_$, context) {
            const config = require('./config')
            Object.assign(context, config)
        }
    },
    print: {
        description: 'Print context file',
        async handle(options, context) {
            console.log(serialize(context))
        }
    },
    pipe: {
        description: 'Print context file',
        handle(options, context) {
            const 
            for(const item of options.source) {
                const target = runTask(item, context)
                if (options.output) {
                    options.output.next(target)
                }
            }
        }
    }
}

function normalizeAction(options) {
    if (!options) {
        throw new Error('Invalid action options')
    }
    if ('string' === typeof options) {
        return Object.assign({ reason: options }, normalizeAction(actions[options]))
    }
    if (Array.isArray(options)) {
        return {
            type: 'job',
            items: options.map(normalizeAction)
        }
    }
    return options
}

function validateAction(options) {
    const opts = normalizeAction(options)
    return opts
}

function getAction(name) {
    const action = validateAction(name)
    action.action = name
    return action
}

function runJob(mode, items, options, context = {}) {
    return modes[mode].handle(items, options, context)
}

async function sequetial(items, options, context = {}) {
    await modes.sequence.handle(items.map(normalizeAction), options, context)
    return context
}

async function runTask(options, context = {}) {
    const action = 'string' === typeof options
        ? getAction(options)
        : options
    switch(action.type) {
        case 'job':
            await runJob(action.mode || 'parallel', action.items, options, context)
            break
        default:
            await action.handle(action, context)
            break
    }
    return context
}

module.exports = { actions, getAction, runTask, runJob, sequetial }
