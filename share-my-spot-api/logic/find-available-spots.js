const { validate } = require('share-my-spot-utils')
const { models: { Spot } } = require('share-my-spot-data')
const { NotFoundError } = require('share-my-spot-errors')

/**
 * Searches through the data base for spots
 * 
 * @param {object} filter spot's query that contains the properties mentioned down below
 * @param {object} _filter spot's query that contains the properties mentioned down below and set up to search only through the "status: 'available'" spots
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
 * @returns {Promise<string>} returns an an array of spots
 * 
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = (filter = {}) => {
    let { addressLocation, length, height, width, price, acceptsBarker } = filter
    let _filter = { status: 'available' }
    validate.type(_filter, '_filter', Object)

    if (typeof addressLocation !== 'undefined') {
        validate.string(addressLocation, 'location')
        _filter.addressLocation = { $regex: addressLocation }
    }

    if (typeof length !== 'undefined') {
        length = Number(length)
        validate.type(length, 'length', Number)
        _filter.length = { $gte: length }
    }

    if (typeof height !== 'undefined') {
        height = Number(height)
        validate.type(height, 'height', Number)
        _filter.height = { $gte: height }
    }

    if (typeof width !== 'undefined') {
        width = Number(width)
        validate.type(width, 'width', Number)
        _filter.width = { $gte: width }
    }

    if (typeof price !== 'undefined') {
        price = Number(price)
        validate.type(price, 'price', Number)
        _filter.price = { $lte: price }
    }

    if (typeof acceptsBarker !== 'undefined') {
        acceptsBarker === 'yes' ? acceptsBarker = true : acceptsBarker = false
        validate.type(acceptsBarker, 'acceptsBarker', Boolean)
        _filter.acceptsBarker = acceptsBarker
    }

    return Spot.find(_filter).populate("publisherId", "name surname email phone").sort({ created: -1 })
        .lean()
        .then(spots => {
            if (!spots) throw new NotFoundError(`no spots were found matching your request`)
            if (spots.length > 0) {
                spots.forEach(spot => {
                    spot.id = spot._id.toString()
                    spot.publisherId.id = spot.publisherId._id.toString()

                    delete spot._id
                    delete spot.__v
                })
                return spots
            } else return []
        })
}