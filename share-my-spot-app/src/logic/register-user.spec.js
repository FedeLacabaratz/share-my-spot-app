const { random } = Math
const { mongoose, models: { User } } = require('share-my-spot-data')
const { registerUser } = require('.')
const bcrypt = require('bcryptjs')

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('registerUser', () => {
    let name, surname, email, phone, password

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()
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

        expect(result).toBeUndefined()

        const user = await User.findOne({ email })

        expect(user).toBeDefined()
        expect(typeof user.id).toBe('string')
        expect(user.name).toBe(name)
        expect(user.surname).toBe(surname)
        expect(user.email).toBe(email)
        expect(user.phone).toBe(phone)
        expect(user.created).toBeInstanceOf(Date)

        const validPassword = await bcrypt.compare(password, user.password)

        expect(validPassword).toBeTruthy()
    })

    it('should fail on non-string name', () => {
        name = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)

        name = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)

        name = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)

        name = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)
    })

    it('should fail on non-string surname', () => {
        surname = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)

        surname = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)

        surname = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)

        surname = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)
    })

    it('should fail on non-string email', () => {
        email = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)
    })

    it('should fail on non-string email', () => {
        phone = 'one'
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `phone ${phone} is not a number`)

        phone = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `phone ${phone} is not a number`)

        phone = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `phone ${phone} is not a number`)

        phone = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `phone ${phone} is not a number`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = null
        expect(() =>
            registerUser(name, surname, email, phone, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})