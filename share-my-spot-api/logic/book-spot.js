const { validate } = require('../../share-my-spot-utils')
const { models: { User, Spot } } = require('../../share-my-spot-data')
const { NotFoundError, ConflictError } = require('../../share-my-spot-errors')

/**
 * Creates a request for booking on a specific spot
 * 
 * @param {string} candidateId user's unique id number (candidate)
 * @param {string} spotId spot's unique id number (spot)
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful booking request
 * 
 * @throws {NotFoundError} on not found data
 * @throws {ConflictError} when conflicts exists contrasting provided data and existing data inside bookingCandidates array
 */

module.exports = (candidateId, spotId) => {
    validate.string(candidateId, 'candidateId')
    validate.string(spotId, 'spotId')

    return (async () => {
        const user = await User.findById(candidateId)
        if (!user) throw new NotFoundError(`booking candidate with id ${candidateId} not found`)

        const spot = await Spot.findById(spotId)
        if (!spot) throw new NotFoundError(`spot with id ${spotId} not found`)

        if(spot.status !== 'available') throw new ConflictError('spot has already been taken')

        const candidateAlreadyExists = spot.bookingCandidates.some(id => id.toString() === candidateId)

        if (candidateAlreadyExists) throw new ConflictError(`candidate with ${candidateId} ID is already within our booking candidates`)
         
        spot.bookingCandidates.push(candidateId)

        return spot.save()
            .then(() => { })
    })()
}
