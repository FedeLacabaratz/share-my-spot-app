const { random } = Math
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { retrieveMySpots } = require('.')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('retrieveMySpots', () => {
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
        phone = 123456 + `${random()}`
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

    describe('when both user and spot exists', () => {
        let id
        beforeEach(() =>
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
        )

        it('should successfully retrieve the specific spot', () => {
            retrieveMySpots(id)
                .then(spots => {

                    expect(spots.length).toEqual(1)
                    expect(spots).toBeInstanceOf(Array)
                    expect(spots[0].id).toEqual(_spotId)
                    expect(spots[0].publisherId.id).toEqual(id)
                })
                .then(() => { })
        })

        describe('when the user does not exist', () => {
            beforeEach(() => User.deleteMany().then(() => { }))

            it('should fail if the user does not exist', () => {
                retrieveMySpots(id)
                    .then(() => { throw new Error('should not reach this point') })
                    .catch(({ message }) => {
                        expect(message).toBeDefined()
                        expect(message).toEqual(`user with id ${id} not found`)
                    })
                    .then(() => { })
            })
        })

    })

    afterAll(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})