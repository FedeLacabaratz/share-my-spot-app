require('dotenv').config()
const { validate } = require('share-my-spot-utils')
const { NotFoundError } = require('share-my-spot-errors')
const { models: { User, Spot } } = require('share-my-spot-data')
const fs = require('fs')
const path = require('path')

/**
* Saves spot image
* 
* @param {ObjectId} userId of user
* @param {ObjectuserI} spotId id of spot
* @param {Stream} file data of the image
* @param {Sting} filename name of the image
*
* @returns {Promise} - user.  
*/


module.exports = function (userId, spotId, file, filename) {
    validate.string(userId, 'userId')
    validate.string(spotId, 'spotId')
    validate.string(filename, 'filename')

    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        const spot = await Spot.findById(spotId)
        if (!spot) throw new NotFoundError(`ad with id ${spotId} not found`)

        const dir = `./data/spots/${spotId}`
        if (!fs.existsSync(dir)) throw new NotFoundError(`folder in ${dir} hasn't been created yet`)

        let saveTo = path.join(__dirname, `../data/spots/${spotId}/${filename}`)
        return file.pipe(fs.createWriteStream(saveTo))
    })()
}
