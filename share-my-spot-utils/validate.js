const { ContentError } = require('share-my-spot-errors')
const atob = require('atob')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
    string(target, name, empty = true) {
        //if (typeof target !== 'string') throw new TypeError(`${name} ${target} is not a string`)
        this.type(target, name, String)
        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },

    email(target) {
        if (!EMAIL_REGEX.test(target)) throw new ContentError(`${target} is not an e-mail`) // TODO custom error?
    },

    type(target, name, type) {
        if (type === String || type === Number || type === Boolean) {
            type = type.name.toLowerCase()
            if(typeof target !== type) throw new TypeError(`${name} ${target} is not a ${type}`)
        }
        else {
            if (type === Date) 
            {
                if (isNaN(Date.parse(target))) throw new TypeError(`${name} ${target} is not a ${type.name}`)
            }
            else if (!(target instanceof type)) throw new TypeError(`${name} ${target} is not a ${type.name}`)
        }
    },
    
    token(token) {
        const [header, payload, signature] = token.split('.')
        if (!header || !payload || !signature) throw new Error('invalid token')
        const { sub } = JSON.parse(atob(payload))
        if (!sub) throw new Error('no user id in token')
    },
}