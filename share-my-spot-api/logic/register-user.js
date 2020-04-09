const { validate } = require('share-my-spot-utils')
const { models: { User } } = require('share-my-spot-data')
const { NotAllowedError } = require('share-my-spot-errors')
const bcrypt = require('bcryptjs')

/**
 * Registers a new user within the database
 * 
 * @param {string} name user's unique name
 * @param {string} surname user's unique surname
 * @param {string} email user's unique e-mail
 * @param {number} phone user's unique phone number
 * @param {string} password user's password
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful registry
 * 
 * @throws {NotAllowedError} when the typed email has already been taken
 */

module.exports = (name, surname, email, phone, password) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(email, 'email')
    validate.email(email)
    validate.type(phone, 'phone', Number)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, surname, email, phone, password, created: new Date })
            
            return user.save()
        })
        .then(() => { })
}