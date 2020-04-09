const { validate } = require('share-my-spot-utils')
const { models: { User, Spot } } = require('share-my-spot-data')
const fs = require('fs').promises
const path = require('path')
const { NotFoundError } = require('share-my-spot-errors')

/**
 * Creates a new spot
 * 
 * @param {string} publisherId spot's unique id user's number (owner)
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
 * @returns {Promise<string>} returns an empty Promise on a successful spot creation
 * 
 * @throws {NotFoundError} if the user does not exist
 */

const filesDir = path.join(__dirname, `../data/spots`)

module.exports = (publisherId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun) => {
    validate.string(publisherId, 'publisherId')
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

    return User.findById(publisherId)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${publisherId} does not exist`)

            const spot = new Spot({ publisherId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun, created: new Date })
            
            user.publishedSpots.push(spot.id)

            return Promise.all([user.save(), spot.save()])
                .then(() => fs.mkdir(path.join(filesDir, spot.id)))
                .then(() => spot.id)
        })
}
