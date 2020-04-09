import context from './context'
const { NotAllowedError } = require('share-my-spot-errors')
require('dotenv').config()

/**
 * Finds and receives data from a desired user
 *
 * @returns {Promise<Object>} user's id, name, surname, email and phone from storage
 * 
 * @throws {NotAllowedError} if the user does not exist
 * @throws {Error} on network connection issues (or unrelated error)
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function () {

    return (async () => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + this.token },
        })

        const { status } = response

        if (status === 200) {
            const user = await response.json()

            return user
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