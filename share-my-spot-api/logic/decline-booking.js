const { validate } = require('share-my-spot-utils')
const { models: { Spot, User } } = require('share-my-spot-data')
const { NotFoundError } = require('share-my-spot-errors')

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
 */

module.exports = (publisherId, candidateId, spotId) => {
    validate.string(publisherId, 'publisherId')
    validate.string(candidateId, 'candidateId')
    validate.string(spotId, 'spotId')

    return (async () => {
        const owner = await User.findById(publisherId)
        if (!owner) throw new NotFoundError(`user with id ${publisherId} not found`)

        const candidate = await User.findById(candidateId)
        if (!candidate) throw new NotFoundError(`user with id ${candidateId} not found`)

        const spot = await Spot.findById(spotId) //remove lean later
        if (!spot) throw new NotFoundError(`spot with id ${spotId} not found`)

        const candidateAlreadyExists = spot.bookingCandidates.some(id => id.toString() === candidateId)

        if (!candidateAlreadyExists) throw new NotFoundError(`candidate with ${candidateId} ID doesn't exist`)
   
        const index = spot.bookingCandidates.indexOf(candidateId)
       
        spot.bookingCandidates.splice(index, 1)

        return spot.save()
        .then(() => { })
    })()
}