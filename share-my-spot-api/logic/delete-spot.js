const { validate } = require('share-my-spot-utils')
const { models: { Spot, User } } = require('share-my-spot-data')
const { NotAllowedError } = require('share-my-spot-errors')

/**
 * Deletes a spot from "My Spots" section
 * 
 * @param {string} userId user's unique id number (owner)
 * @param {string} spotId spot's unique id number (spot)
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful spot removal
 * 
 * @throws {NotAllowedError} when user can't delete the spot (not the owner)
 */

module.exports = (userId, spotId) => {
    validate.string(userId, 'userId')
    validate.string(spotId, 'spotId')

    if (!spotId) throw new NotFoundError(`no spots were found matching your request`)
    return User.findOne({ _id: userId, publishedSpots: spotId })
    .then(correct => {
            if (correct) {
                return User.find({ publishedSpots: spotId })
            }
            else {
                throw new NotAllowedError('This user cannot delete this spot')
            }
        })
        .then(usersArray => {
            return usersArray.forEach(async user => await User.findByIdAndUpdate(user.id, { $pull: { publishedSpots: spotId } }))
        })
        .then(() => Spot.findByIdAndRemove(spotId))
        .then(() => { })
}