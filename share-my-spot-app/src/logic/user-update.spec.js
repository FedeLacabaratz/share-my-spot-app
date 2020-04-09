const { random } = Math
const { mongoose, models: { User } } = require('share-my-spot-data')
const { NotAllowedError } = require('share-my-spot-errors')
const { userUpdate, login } = require('.')
const bcrypt = require('bcryptjs')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('updateUser', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
    })


    let userId, name, surname, email, phone, password, oldPassword, data

    beforeEach(() => {
        name = 'name-' + random()
        surname = 'surname-' + random()
        email = random() + '@mail.com'
        phone = 666555444
        password = 'password-' + random()
    })

    describe('when user already exists', () => {
        let _id
        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)
            await User.create({ name, surname, email, phone, password: _password })
                .then(user => _id = user.id)
            await login(email, password)

            const { token } = context

            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)

            const { sub } = JSON.parse(atob(token.split('.')[1]))
            expect(sub).toBe(_id)

        })

        it('should succeed on valid id and credentials', async () => {
            name += '-update'
            email = 'update-@email.com'
            oldPassword = password
            password += '-update'
            phone = 123456789

            await userUpdate({ email, phone, password, oldPassword })

            const _user = await User.findById(_id).lean()

            expect(_user.email).toBe(email)
            expect(_user.phone).toBe(phone)

            const validPassword = await bcrypt.compare(password, _user.password)

            expect(validPassword).toBeTruthy()

        })

        it('should fail on invalid oldPassword', async () => {
            name += '-update'
            surname += '-update'
            email = 'update-@email.com'
            oldPassword = password + 'wrong'
            password += '-update'
            phone = 123456789

            try {
                await userUpdate({ email, phone, password, oldPassword })
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).toBeInstanceOf(NotAllowedError)
                expect(error.message).toBe('This email is already in use.')
            }

        })

    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })

})