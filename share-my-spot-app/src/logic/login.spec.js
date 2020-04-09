const { random } = Math
const { mongoose, models: { User } } = require('share-my-spot-data')
const { login } = require('.')
const bcrypt = require('bcryptjs')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
} } = process

describe('login', () => {

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
    })

    let name, surname, email, phone, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        phone = 123456 + `${random()}`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let _id
        beforeEach(async () => {

            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, email, phone, password: _password })
            .then(user => _id = user.id)
        })

        it('should succeed on correct credentials', async () => {
            await login(email, password)

            const { token } = context

            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)

            const { sub } = JSON.parse(atob(token.split('.')[1]))
            expect(sub).toBe(_id)
        })

        it('should fail on incorrect email', async () => {
            email = `email-${random()}@mail.com`

            try {
                await login(email, password)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`wrong credentials`)
            }
        })

        it('should fail on incorrect password', async () => {
            password = `password-${random()}`

            try {
                await login(email, password)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`wrong credentials`)
            }
        })
    })

    it('should fail when user does not exist', async () => {
        email = `email-${random()}@mail.com`
        password = `password-${random()}`

        try {
            await login(email, password)

            throw new Error('you should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toBe(`wrong credentials`)
        }
    })

    it('should fail on non-string email', () => {
        email = 1
        expect(() =>
            login(email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = true
        expect(() =>
            login(email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() =>
            login(email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() =>
            login(email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            login(email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            login(email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})