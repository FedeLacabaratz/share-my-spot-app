require('dotenv').config()
const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User } } = require('share-my-spot-data')
const { expect } = require('chai')
const retrieveUser = require('./retrieve-user')
const { NotFoundError } = require('share-my-spot-errors')
const bcrypt = require('bcryptjs')

describe('retrieveUser', () => {
    let name, surname, email, phone, password


    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
    })


    beforeEach(() => {
        name = 'name-' + Math.random()
        surname = 'surname-' + Math.random()
        email = Math.random() + '@mail.com'
        phone = 666555444
        password = 'password-' + Math.random()

    })
    describe('when user exists', () => {
        let _id
        describe('when user is not deactivated', () => {
            beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, email, phone, password })
                )
                .then(user => _id = user.id)
        )

            it('should succeed on valid id, returning the user', () => {
                return retrieveUser(_id)
                    .then(user => {
                        expect(user.constructor).to.equal(Object)
                        expect(user.name).to.equal(name)
                        expect(user.surname).to.equal(surname)
                        expect(user.email).to.equal(email)
                        expect(user.phone).to.equal(phone)
                        expect(user.password).to.be.undefined
                    })
            })
        })
    })

    it('should fail on non-string or empty id', () => {
        let id = 1
        expect(() => retrieveUser(id)).to.throw(TypeError, `id ${id} is not a string`)

        id = true
        expect(() => retrieveUser(id)).to.throw(TypeError, `id ${id} is not a string`)

        id = {}
        expect(() => retrieveUser(id)).to.throw(TypeError, `id ${id} is not a string`)

        id = ''
        expect(() => retrieveUser(id)).to.throw(Error, `id is empty`)
    })

    after(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })

})