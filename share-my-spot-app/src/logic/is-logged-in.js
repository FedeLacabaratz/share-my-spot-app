import context from './context'

export default (function () {
    return !!this.token
}).bind(context)