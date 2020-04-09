const { random } = Math
const { retrieveUser } = require('.')
const { mongoose, models: { User } } = require('share-my-spot-data')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('retrieveUser', () => {
    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, email, phone, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        phone = 24234234
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        beforeEach(() =>
            User.create({ name, surname, email, phone, password })
                .then(({ id }) => context.token = jwt.sign({ sub: id }, TEST_JWT_SECRET))
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveUser()
                .then(user => {
                    expect(user).toBeDefined()
                    expect(user.name).toBe(name)
                    expect(user.surname).toBe(surname)
                    expect(user.email).toBe(email)
                    expect(user.phone).toBe(phone)
                    expect(user.password).toBeUndefined()
                })
        )

        it('should fail on invalid token', async () => {
            try {
                await retrieveUser(`${token}-wrong`)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`token is not defined`)
            }
        })
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})