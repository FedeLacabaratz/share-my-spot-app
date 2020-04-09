require('dotenv').config()

const updateUser = require('./update-user')
const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User } } = require('share-my-spot-data')
const { NotAllowedError } = require('share-my-spot-errors')
const { expect } = require('chai')
const { random } = Math
const bcrypt = require('bcryptjs')

describe('updateUser', () => {
    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await User.deleteMany()
    })


    let userId, name, surname, email, phone, password, oldPassword

    beforeEach(() => {
        name = 'name-' + random()
        surname = 'surname-' + random()
        email = random() + '@mail.com'
        phone = 666555444
        password = 'password-' + random()
    })

    describe('when user already exists', () => {

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)
            const user = await User.create({ name, surname, email, phone, password: _password })
            userId = user.id
        })

        it('should succeed on valid id and credentials', async () => {
            name += '-update'
            email = 'update-@email.com'
            oldPassword = password
            password += '-update'
            phone = 123456789

            await updateUser(userId, { email, password, oldPassword, phone })

            const _user = await User.findById(userId).lean()

            expect(_user.email).to.equal(email)
            expect(_user.phone).to.equal(phone)

            const validPassword = await bcrypt.compare(password, _user.password)

            expect(validPassword).to.be.true

        })

        it('should fail on invalid oldPassword', async () => {
            name += '-update'
            surname += '-update'
            email = 'update-@email.com'
            oldPassword = password + 'wrong'
            password += '-update'
            phone = 123456789

            try {
                await updateUser(userId, { email, password, oldPassword, phone })
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.be.an.instanceOf(NotAllowedError)
                expect(error.message).to.equal('This email is already in use.')
            }

        })

    })

    it('should fail on non-string id', () => {
        userId = 1
        expect(() =>
            updateUser(userId, {}, () => { })
        ).to.Throw(TypeError, `userId ${userId} is not a string`)

        userId = true
        expect(() =>
            updateUser(userId, {}, () => { })
        ).to.Throw(TypeError, `userId ${userId} is not a string`)

        userId = undefined
        expect(() =>
            updateUser(userId, {}, () => { })
        ).to.Throw(TypeError, `userId ${userId} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))

})
