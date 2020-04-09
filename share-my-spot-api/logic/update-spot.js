const { validate } = require('share-my-spot-utils')
const { models: { User, Spot } } = require('share-my-spot-data')
const { NotFoundError } = require('share-my-spot-errors') 

/**
 * Updates the spot info
 * 
 * @param {string} userId user's unique id
 * @param {object} body the elements that will be updated
 * @param {string} spotId spot's unique id
 * 
 * @returns {Promise<string>} an empty Promise on a successful update
 * 
 */

module.exports = (userId, body, spotId) => {
    validate.string(userId, 'userId')
    validate.type(body, 'body', Object)
    validate.string(spotId, 'spotId')

    return (async ()=> {

        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        await Spot.findOneAndUpdate({ _id: spotId, publisherId: userId }, { $set: body, bookingCandidates: [], status: 'available'})

        const spot = await Spot.findById(spotId)
        if (!spot) throw new NotFoundError(`spot with id ${spotId} not found`)
        
        spot.bookedTo = undefined

        await spot.save()

        return spot
    
    })()

}