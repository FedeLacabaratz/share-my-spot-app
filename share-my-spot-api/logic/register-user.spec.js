require('dotenv').config()
const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User } } = require('share-my-spot-data')
const registerUser = require('./register-user')
const bcrypt = require('bcryptjs')

const { env: { TEST_MONGODB_URL } } = process

describe('registerUser', () => {
    let name, surname, email, phone, password

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        phone = 666555444
        password = `password-${random()}`
    })

    it('should succeed on correct user data', async () => {
        const result = await registerUser(name, surname, email, phone, password)
        expect(result).to.be.undefined

        const user = await User.findOne({ email })
        expect(user).to.exist
        expect(user.name).to.equal(name)
        expect(user.surname).to.equal(surname)
        expect(user.email).to.equal(email)
        expect(user.phone).to.equal(phone)
        expect(user.created).to.be.an.instanceof(Date)

        const validPass = await bcrypt.compare(password, user.password)
        expect(validPass).to.be.true
    })

    describe('when user already exists', () => {

        it('should fail on already registered user', async () => {
            try {
                await registerUser(name, surname, email, phone, password)

                throw new Error(`user with email ${email} already exists`)

            } catch (error) {
                expect(error).to.exist
                expect(error.message).to.equal(`user with email ${email} already exists`)

            }
        })
    })

    it('should fail on non-string name', () => {
        name = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `name ${name} is not a string`)

        name = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `name ${name} is not a string`)

        name = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `name ${name} is not a string`)

        name = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `name ${name} is not a string`)
    })

    it('should fail on non-string surname', () => {
        surname = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `surname ${surname} is not a string`)

        surname = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `surname ${surname} is not a string`)

        surname = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `surname ${surname} is not a string`)

        surname = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `surname ${surname} is not a string`)
    })

    it('should fail on non-string email', () => {
        email = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `email ${email} is not a string`)

        email = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `email ${email} is not a string`)

        email = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `email ${email} is not a string`)
    })

    it('should fail on non-number phone', () => {
        phone = 'one'
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `phone ${phone} is not a number`)

        phone = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `phone ${phone} is not a number`)

        phone = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `phone ${phone} is not a number`)

        phone = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `phone ${phone} is not a number`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `password ${password} is not a string`)

        password = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).to.throw(TypeError, `password ${password} is not a string`)
    })

    after(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})