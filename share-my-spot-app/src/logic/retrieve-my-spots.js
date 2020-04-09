import context from './context'
const { NotAllowedError } = require('share-my-spot-errors')
require('dotenv').config()

/**
 * Retrieves the spots I have published
 * 
 * @returns {Promise<string>} returns the spots that have created
 * 
 * @throws {NotFoundError} on not found user id or spots created with this user id
 * @throws {Error} on network connection issues (or unrelated error)
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function () {

    return (async () => {
        const response = await fetch(`${API_URL}/spots`, {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + this.token }
        })

        const { status } = response

        if (status === 200){
            const spots = await response.json()
            return spots
        }

        if (status >= 400 && status < 500) {

            const { error } = await response.json()

            if (status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)

        }
        throw new Error('server error')

    })()
}).bind(context)