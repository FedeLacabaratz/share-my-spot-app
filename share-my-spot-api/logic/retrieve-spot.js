const { models: { Spot } } = require('share-my-spot-data')
const { validate } = require('share-my-spot-utils')
const { NotFoundError } = require('share-my-spot-errors')

/**
 * Retrieves a specific spot I have published
 * 
 * @param {string} spotId spot's unique id number
 * 
 * @returns {Promise<string>} returns the spot that I am requesting
 * 
 * @throws {NotFoundError} on not found spot id 
 */

module.exports = spotId => {
    validate.string(spotId, 'spotId')
    if (!spotId) throw new NotFoundError(`${spotId} is not a valid id`)

    return (async () => {
        
        const spot = await Spot.findById(spotId).populate("publisherId", "name surname email phone").lean()  

        if (!spot) throw new NotFoundError(`spot with id ${spotId} doesn't exists`)

        spot.id = spot._id.toString()
        spot.publisherId.id = spot.publisherId._id.toString()

        delete spot._id
        delete spot.__v
        delete spot.publisherId._id

        return spot

    })()
}