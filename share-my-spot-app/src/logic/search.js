import context from './context'
const { NotAllowedError } = require('share-my-spot-errors')
require('dotenv').config()

/**
 * Searches through the data base for spots
 * 
 * @param {object} query spot's query that contains the properties mentioned down below
 * 
 * @returns {Promise<string>} returns an an array of spots
 * 
 * @throws {NotFoundError} if the user does not exist
 * @throws {Error} on network connection issues (or unrelated error)
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function (query) {
    
    return (async () => {
        const res = await fetch(`${API_URL}/?${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })

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
}).bind(context)