const { random } = Math
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { retrieveMyBookings } = require('.')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('retrieveMyBookings', () => {
    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Spot.deleteMany()]))
            .then(() => { })
    )

    let name, name2, surname, surname2, email, email2, phone, phone2, password, password2, _id, _id2, _spotId, publisherId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        phone = 123456 + `${random()}`
        password = `password-${random()}`

        name2 = `name-${random()}`
        surname2 = `surname-${random()}`
        email2 = `email-${random()}@mail.com`
        phone2 = 123456 + `${random()}`
        password2 = `password-${random()}`

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
        beforeEach(() =>
        Promise.all([User.create({ name, surname, email, phone, password }), User.create({ name: name2, surname: surname2, email: email2, phone: phone2, password: password2 })])
        .then(([user, user2]) => {
            _id = user.id.toString()
            _id2 = user2.id.toString()
        })
        .then(() => Promise.resolve(Spot.create({ publisherId: _id, title: title, addressLocation: addressLocation, addressStNumber: addressStNumber, addressOther: addressOther, length: length, width: width, height: height, area: area, description: description, price: price, acceptsBarker: acceptsBarker, surveillance: surveillance, sCovered: isCovered, hourStarts: hourStarts, hourEnds: hourEnds, mon: mon, tue: tue, wed: wed, thu: thu, fri: fri, sat: sat, sun: sun, bookingCandidates: [ _id2] })))
                .then(({ id }) => _spotId = id)
                .then(() => Promise.all([User.findByIdAndUpdate(_id, { $push: { publishedSpots: _spotId } }), Spot.findByIdAndUpdate(_spotId)]))
                .then(([user, spot]) => {
                    return Promise.all([user.save(), spot.save()])
                })
                .then(() => { })
        )

        it('should successfully retrieve the specific spot', () => {
            retrieveMyBookings(_id)
                .then(spots => {
                    
                    expect(spots.length).toEqual(1)
                    expect(spots).toBeInstanceOf(Array)
                    expect(spots[0].id).toEqual(_spotId)
                    expect(spots[0].publisherId.id).toEqual(_id)
                    expect(spots[0].bookingCandidates[0]).toEqual(_id2)
                })
                .then(() => { })
        })

        describe('when the user does not exist', () => {
            beforeEach(() => User.deleteMany().then(() => { }))

            it('should fail if the user does not exist', () => {
                retrieveMyBookings(_id)
                    .then(() => { throw new Error('should not reach this point') })
                    .catch(({ message }) => {
                        expect(message).toBeUndefined()
                        expect(message).toEqual(`user with id ${_id} not found`)
                    })
                    .then(() => { })
            })
        })

    })

    afterAll(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})