module.exports = class ConflictError extends Error {
    constructor(...args) {
        super(...args)

        this.name = ConflictError.name
    }
}