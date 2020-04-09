import { validate } from 'share-my-spot-utils'
import { NotAllowedError } from 'share-my-spot-errors'
import context from './context'
require('dotenv').config()

/**
 * Updates the spot info
 * 
 * @param {object} body which contains the elements that will be updated
 * @param {string} spotId spot's unique id
 * 
 * @returns {Promise<string>} an empty Promise on a successful update
 * @throws {NotFoundError} on not found user id or spots created with this user id
 * @throws {Error} on network connection issues (or unrelated error)
 * 
 */

const API_URL = process.env.REACT_APP_API_URL

export default (function (body, spotId) {
    let { title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun } = body

    validate.string(spotId, 'spotId')
    validate.string(title, 'title')
    validate.string(addressLocation, 'addressLocation')
    validate.string(addressStNumber, 'addressStNumber')
    validate.string(addressOther, 'addressOther')
    validate.type(length, 'length', Number)
    validate.type(width, 'width', Number)
    validate.type(height, 'height', Number)
    validate.type(area, 'area', Number)
    validate.string(description, 'description')
    validate.type(price, 'price', Number)

    if (typeof acceptsBarker !== 'undefined') {
        acceptsBarker === 'yes' ? acceptsBarker = true : acceptsBarker = false
        validate.type(acceptsBarker, 'acceptsBarker', Boolean)
    }

    if (typeof surveillance !== 'undefined') {
        surveillance === 'yes' ? surveillance = true : surveillance = false
        validate.type(surveillance, 'surveillance', Boolean)
    }

    if (typeof isCovered !== 'undefined') {
        isCovered === 'yes' ? isCovered = true : isCovered = false
        validate.type(isCovered, 'isCovered', Boolean)
    }

    validate.string(hourStarts, 'hourStarts')
    validate.string(hourEnds, 'hourEnds')

    if (typeof mon !== 'undefined') {
        mon === 'yes' ? mon = true : mon = false
        validate.type(mon, 'mon', Boolean)
    }

    if (typeof tue !== 'undefined') {
        tue === 'yes' ? tue = true : tue = false
        validate.type(tue, 'tue', Boolean)
    }

    if (typeof wed !== 'undefined') {
        wed === 'yes' ? wed = true : wed = false
        validate.type(wed, 'wed', Boolean)
    }

    if (typeof thu !== 'undefined') {
        thu === 'yes' ? thu = true : thu = false
        validate.type(thu, 'thu', Boolean)
    }

    if (typeof fri !== 'undefined') {
        fri === 'yes' ? fri = true : fri = false
        validate.type(fri, 'fri', Boolean)
    }

    if (typeof sat !== 'undefined') {
        sat === 'yes' ? sat = true : sat = false
        validate.type(sat, 'sat', Boolean)
    }

    if (typeof sun !== 'undefined') {
        sun === 'yes' ? sun = true : sun = false
        validate.type(sun, 'sun', Boolean)
    }
    return (async () => {
        const response = await fetch(`${API_URL}/update-spot/${spotId}`, {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const { status } = response

        if (status === 200) return

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