require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { expect } = require('chai')
const { random } = Math
const retrieveSpot = require('./retrieve-spot')

describe('retrieveSpot', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Spot.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, phone, password, _id, _spotId, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun

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

    describe('when both user and spot exist', () => {
        beforeEach(() =>
            Promise.resolve(User.create({ name, surname, email, phone, password }))
                .then(({ id }) => _id = id)
                .then(() => Promise.resolve(Spot.create({ publisherId: _id, title: title, addressLocation: addressLocation, addressStNumber: addressStNumber, addressOther: addressOther, length: length, width: width, height: height, area: area, description: description, price: price, acceptsBarker: acceptsBarker, surveillance: surveillance, sCovered: isCovered, hourStarts: hourStarts, hourEnds: hourEnds, mon: mon, tue: tue, wed: wed, thu: thu, fri: fri, sat: sat, sun: sun })))
                .then(({ id }) => _spotId = id)
                .then(() => Promise.all([User.findById(_id), Spot.findById(_spotId)]))
                .then(([user, spot]) => {
                return Promise.all([user.save(), spot.save()])
                })
                .then(() => { })
        )

        it('should successfully retrieve the specific spot', () =>
            retrieveSpot(_spotId)
                .then(spot => {
                    expect(_spotId).to.exist
                    expect(_spotId).to.be.a('string')
                    expect(_spotId).to.have.lengthOf.at.least(1)

                    expect(spot.addressLocation).to.exist
                    expect(spot.addressLocation).to.be.a('string')
                    expect(spot.addressLocation).to.have.lengthOf.at.least(1)

                    expect(spot.length).to.exist
                    expect(spot.length).to.be.a('number')
                    expect(spot.length).to.be.at.least(0.1)

                    expect(spot.width).to.exist
                    expect(spot.width).to.be.a('number')
                    expect(spot.width).to.be.at.least(0.1)

                    expect(spot.height).to.exist
                    expect(spot.height).to.be.a('number')
                    expect(spot.height).to.be.at.least(0.1)

                    expect(spot.price).to.exist
                    expect(spot.price).to.be.a('number')
                    expect(spot.price).to.be.at.least(0.1)

                    expect(spot.acceptsBarker).to.exist
                    expect(spot.acceptsBarker).to.be.a('boolean')

                })
                .then(() => { })
        )
    })

    describe('when the spot does not exist', () => {
        beforeEach(() =>
            Spot.deleteMany()
                .then(() => User.findByIdAndUpdate(_id))
                .then(() => { })
        )

        it('should fail to retrieve the spot post when it does not exist', () =>
            retrieveSpot(_spotId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`spot with id ${_spotId} doesn't exists`)
                })
                .then(() => { })
        )
    })

    describe('unhappy paths', () => {
        it('should fail on a non-string spot id', () => {
            _spotId = 9328743289
            expect(() => retrieveSpot(_spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)

            _spotId = false
            expect(() => retrieveSpot(_spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)

            _spotId = undefined
            expect(() => retrieveSpot(_spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)

            _spotId = []
            expect(() => retrieveSpot(_spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)
        })
    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})
