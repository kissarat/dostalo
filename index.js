const { sequetial, runTask, getAction, runJob } = require("./actions")
const { isPromise, isGeneratorFunction } = require("./predicates")

async function main(items, config, context = {}) {
    try {
        let i = 0
        for (const item of items) {
            const action = getAction({ ...config, action: item })
            let result = action.handle(config, context)
            if (result) {
                if (isPromise(result)) {
                    result = await result
                }
                if (result.input) {
                    const sub = items.slice(i+1)
                    for(const sourceItem of result.input) {
                        const target = main(sub, sourceItem)
                        if (result.output) {
                            if (sourceItem.id) {
                                target.id = sourceItem.id
                            }
                            result.output.next(target)
                        }
                    }
                }
            }
            i++
        }
        return context
    } catch (err) {
        console.error(err)
    }
}

if (!module.parent) {
    const { items, ...config } = require("./config")
    void main(items, config)
}

module.exports = { main }
