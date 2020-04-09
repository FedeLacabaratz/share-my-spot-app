require('dotenv').config()
const { validate } = require('share-my-spot-utils')
const { NotFoundError } = require('share-my-spot-errors')
const { ObjectId, models: { Spot } } = require('share-my-spot-data')
const fs = require('fs')
const path = require('path')

/**
 * Retrieves a photo from a provided path where it was originally saved to
 * 
 * @param {ObjectId} spotId id of the spot
 * @returns {Promise} - data of image  
 */

module.exports = function (spotId) {
    validate.string(spotId, 'spotId')

    return (async () => {
        const spot = Spot.findById(spotId)
        if (!spot) throw new NotFoundError(`spot with id ${spotId} not found`)

        const defaultImage = path.join(__dirname, `../data/defaultimage/avatar00.jpg`)

        try {
            let goTo = path.join(__dirname, `../data/spots/${spotId}`)
            var files = fs.readdirSync(goTo)
            const imageIndex = files.findIndex((file) => file.includes('spot01'));
            if (imageIndex !== -1) {
                return fs.createReadStream(`${goTo}/${files[imageIndex]}`)
            }
        } catch ({ message }) {
            console.log(message)
        }

        return fs.createReadStream(defaultImage)

    })()
}