const { validate } = require('../../share-my-spot-utils')
const { models: { User } } = require('../../share-my-spot-data')
const { NotFoundError, NotAllowedError } = require('../../share-my-spot-errors')
const bcrypt = require('bcryptjs')

/**
 * Updates the user's info
 * 
 * @param {string} userId user's unique id
 * @param {object} body the elements that will be updated
 * @param {string} email user's unique e-mail
 * @param {number} phone user's unique phone number
 * @param {string} oldPassword user's oldPassword (required to update to a new one)
 * @param {string} password user's password
 * 
 * @returns {Promise<string>} an empty Promise on a successful update
 * 
 * @throws {NotAllowedError} if a user set a wrong password
 */

module.exports = (userId, body) => {
    const {email, phone, oldPassword, password} =  body

    let email_
    let phone_

    validate.string(userId, 'userId')
    if (email){
        validate.string(email, 'email')
        validate.email(email)
        email_ = email
    }
    if (phone){
        validate.type(phone, 'phone', Number)
        phone_ = phone
    }
    if (oldPassword && password){
        validate.string(oldPassword, 'oldPassword')
        validate.string(password, 'password')
    }

    return User.findOne({email})
        .then(incorrect =>{
            if (incorrect) throw new NotAllowedError('This email is already in use.')
            return User.findById(userId)
        })
        .then(user => {
            if (!email){
                email_ = user.email
            }
            if (!phone){
                phone_ = user.phone
            }
            if (user) {
                if (oldPassword){
                    return bcrypt.compare(oldPassword, user.password)
                }
                return
            }else{
                throw new NotFoundError('This user cannot change the data')
            }
        })
        .then((correct) => {
            if (correct && oldPassword){
                return bcrypt.hash(password, 10)

            }if (oldPassword){
                throw new NotAllowedError('Old password incorrect')
            }else{
                return
            }    
        })
        .then(nPassword => {
            if (nPassword){
                return User.findByIdAndUpdate(userId , { $set: {email: email_, phone: phone_, password: nPassword}})
            }
            else{
                return Promise.all([User.findByIdAndUpdate(userId , { $set: {email: email_}}), User.findByIdAndUpdate(userId , { $set: {phone: phone_}})])
            }
        })
        .then(() => {})
}