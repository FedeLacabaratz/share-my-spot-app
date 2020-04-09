import { NotAllowedError, NotFoundError } from 'share-my-spot-errors'
import context from './context'
require('dotenv').config()

/**
 * Declines a request for booking on a specific spot
 * 
 * @param {string} publisherId user's unique id number (owner)
 * @param {string} candidateId user's unique id number (candidate)
 * @param {string} spotId spot's unique id number (spot)
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful booking refusal
 * 
 * @throws {NotFoundError} on not found data
 * @throws {NotAllowedError} on wrong credentials
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function (publisherId, candidateId, spotId) {

    return (async () => {
        
        let response = await fetch(`${API_URL}/spots/${spotId}/candidate/${candidateId}/decline`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            },
        })

        const { status } = response

        if (status === 201) return
        
        const { message } = response

        if (status === 401) throw new NotAllowedError(message)

        if (status === 404) throw new NotFoundError(message)

    })()

}).bind(context)