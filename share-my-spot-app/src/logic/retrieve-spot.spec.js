const { random } = Math
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { retrieveSpot } = require('.')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('retrieveSpot', () => {
    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Spot.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, phone, password, _spotId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        phone = 123456
        password = `password-${random()}`

        title = `title-${random()}`
        addressLocation = `barcelona`
        addressStNumber = `addressStNumber-${random()}`
        addressOther = `addressOther-${random()}`
        length = 4.5
        width = 2.22
        height = 2.4
        area = 10
        description = `description-${random()}`
        price = 2
        acceptsBarker = 'yes'
        surveillance = 'no'
        isCovered = 'yes'
        hourStarts = '9:00'
        hourEnds = '18:00'
        mon = 'yes'
        tue = 'yes'
        wed = 'yes'
        thu = 'yes'
        fri = 'yes'
        sat = false
        sun = false

    })

    describe('when both user and spot exist', () => {
        let id
        beforeEach(() => {
            Promise.all([User.create({ name, surname, email, phone, password }),
            Spot.create({ id, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun })])
                .then(([user, spot]) => {
                    id = user.id
                    context.token = jwt.sign({ sub: id }, TEST_JWT_SECRET)
                    _spotId = spot.id
                    user.save()
                    return spot.save()
                })
                .then(() => { })
        })

        it('should successfully retrieve the specific spot', () => {
            retrieveSpot(_spotId)
                .then(spot => {
                    expect(_spotId).toBeDefined()
                    expect(_spotId).toBe('string')
                    expect(_spotId).toHaveLength(1)

                    expect(spot.addressLocation).toBeDefined()
                    expect(spot.addressLocation).toBe('string')
                    expect(spot.addressLocation).toHaveLength(1)

                    expect(spot.length).toBeDefined()
                    expect(spot.length).toBe('number')
                    expect(spot.length).toBeGreaterThan(0.1)

                    expect(spot.width).toBeDefined()
                    expect(spot.width).toBe('number')
                    expect(spot.width).toBeGreaterThan(0.1)

                    expect(spot.height).toBeDefined()
                    expect(spot.height).toBe('number')
                    expect(spot.height).toBeGreaterThan(0.1)

                    expect(spot.price).toBeDefined()
                    expect(spot.price).toBe('number')
                    expect(spot.price).toBeGreaterThan(0.1)

                    expect(spot.acceptsBarker).toBeDefined()
                    expect(spot.acceptsBarker).toBe('boolean')

                })
                .then(() => { })
        })
    })

    describe('when the spot does not exist', () => {
        let id
        beforeEach(() => {
            Spot.deleteMany()
                .then(() => User.findByIdAndUpdate(id))
                .then(() => { })
        })

        it('should fail to retrieve the spot post when it does not exist', () => {
            retrieveSpot(_spotId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).toBe(`spot with id ${id} does not exists`)
                    expect(message).toBe(`spot with id ${_spotId} doesn't exists`)
                })
                .then(() => { })
        })
    })

    afterAll(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})