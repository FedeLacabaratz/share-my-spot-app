import { NotAllowedError, NotFoundError } from 'share-my-spot-errors'
import context from './context'
require('dotenv').config()

/**
 * Adds a new spot
 * 
 * @param {string} title spot's title
 * @param {string} addressLocation spot's address location
 * @param {string} addressStNumber spot's address street & number
 * @param {string} addressOther spot's address other information
 * @param {number} length spot's length (mt)
 * @param {number} width spot's width (mt)
 * @param {number} height spot's height (mt)
 * @param {number} area spot's area (mt)
 * @param {string} description spot's description information
 * @param {number} price spot's price (€/hr)
 * @param {boolean} acceptsBarker spot's option in case the owner accepts barker exchange
 * @param {boolean} surveillance spot's option in case the owner place has its own surveillance
 * @param {boolean} isCovered spot's option in case the owner place is covered
 * @param {string} hourStarts hour to be set to start availability of occupancy
 * @param {string} hourStarts hour to be set to end availability of occupancy
 * @param {boolean} mon day of the week (Monday), to be set to specify availability of occupancy for that specific day
 * @param {boolean} tue day of the week (Tuesday), to be set to specify availability of occupancy for that specific day
 * @param {boolean} wed day of the week (Wednesday), to be set to specify availability of occupancy for that specific day
 * @param {boolean} thu day of the week (Thursday), to be set to specify availability of occupancy for that specific day
 * @param {boolean} fri day of the week (Friday), to be set to specify availability of occupancy for that specific day
 * @param {boolean} sat day of the week (Saturday), to be set to specify availability of occupancy for that specific day
 * @param {boolean} sun day of the week (Sunday), to be set to specify availability of occupancy for that specific day
 * 
 * @returns {Promise<string>} returns a Promise on a successful spot creation providing also the id of the publisher
 * 
 * @throws {NotFoundError} on not found data
 * @throws {NotAllowedError} on wrong credentials
 * @throws {Error} on unrelated error
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function (title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun) {

    return (async () => {
        let response = await fetch(`${API_URL}/spots`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun})
        })

        const { status } = response

        response = await response.json()

        if (status === 201) {
            const { id } = response
            
            return id
        }
        
        const { message } = response

        if (status === 401) throw new NotAllowedError(message)

        if (status === 404) throw new NotFoundError(message)

        throw new Error(message)
    })()

}).bind(context)