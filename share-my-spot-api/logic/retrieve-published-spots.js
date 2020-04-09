const { models: { User, Spot } } = require('share-my-spot-data')
const { validate } = require('share-my-spot-utils')
const { NotFoundError } = require('share-my-spot-errors')

/**
 * Retrieves the spots I have published
 * 
 * @param {string} id user's unique id number (candidate)
 * 
 * @returns {Promise<string>} returns the spots that have created
 * 
 * @throws {NotFoundError} on not found user id or spots created with this user id
 */

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            return Spot.find({ publisherId: id, created: { $lte: new Date } }).populate("publisherId", "name surname email phone").sort({ created: -1 })
                .lean()
                .then(spots => {
                    if (!spots) throw new NotFoundError(`no spots were found matching your request`)
                    spots.forEach(spot => {
                        spot.id = spot._id.toString()
                        spot.publisherId.id = spot.publisherId._id.toString()

                        delete spot._id
                        delete spot.__v
                        
                    })
                    return spots
                })
        }) 
}