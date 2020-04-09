const { models: { User, Spot } } = require('share-my-spot-data')
const { validate } = require('share-my-spot-utils')
const { NotFoundError } = require('share-my-spot-errors')

/**
 * Retrieves my bookings made to another spots as a candidate
 * 
 * @param {string} id user's unique id number (candidate)
 * 
 * @returns {Promise<string>} returns the spots that have applied to as candidate or the ones that I have been accepted from
 * 
 * @throws {NotFoundError} on not found user id
 */

module.exports = id => {
    validate.string(id, 'id')

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const spots = await Spot.find({$or:[ {'bookingCandidates': id}, {'bookedTo': id} ]}).populate("publisherId", "name surname email phone")
        .lean()

        spots.forEach(spot => {
            spot.id = spot._id.toString()

            delete spot._id
            delete spot.__v

        })

        return spots

    })()
}