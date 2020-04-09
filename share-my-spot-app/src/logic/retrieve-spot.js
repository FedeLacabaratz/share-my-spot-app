import context from './context'
const { NotAllowedError } = require('share-my-spot-errors')
require('dotenv').config()

/**
 * Retrieves a specific spot I have published
 * 
 * @param {string} spotId spot's unique id number
 * 
 * @returns {Promise<string>} returns the spot that I am requesting
 * 
 * @throws {NotFoundError} on not found spot id
 * @throws {Error} on network connection issues (or unrelated error) 
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function (spotId) {

    return (async () => {
        const res = await fetch(`${API_URL}/${spotId}`)

        const {status} = res

        if (status === 200) {
            const results = await res.json()

            return results
        }

        if (status >= 400 && status < 500) {

            const { error } = await res.json()

            if (status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)

        }
        throw new Error('server error')

    })()
})