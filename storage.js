const { isObjectLike } = require('./predicates')

class Storage {
    constructor() {
        this.dictionary = new Map()
    }

    async get(id) {
        const value = this.dictionary.get(id)
        return value
    }

    async put({ id, ...value }) {
        this.dictionary.set(id, value)
    }

    async set(id, value) {
        this.dictionary.set(id, value)
    }

    async del(id) {
        return this.dictionary.delete(id)
    }
    
    async update(id, changes) {
        return Object.assign(this.dictionary.get(id), changes)
    }
}

const tasks = new Storage()
module.exports = { tasks }
