require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { expect } = require('chai')
const { random } = Math
const findAvailableSpots = require('./find-available-spots')
const bcrypt = require('bcryptjs')

describe('findAvailableSpots', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Spot.deleteMany()]))
            .then(() => { })
    )

    let name, name2, surname, surname2, email, email2, phone, phone2, password, password2, _id, _id2, _spotId, _spotId2, publisherId, publisherId2, title, title2, addressLocation, addressLocation2, addressStNumber, addressStNumber2, addressOther, addressOther2, length, length2, width, width2, height, height2, area, area2, description, description2, price, price2, acceptsBarker, acceptsBarker2, surveillance, surveillance2, isCovered, isCovered2, hourStarts, hourStarts2, hourEnds, hourEnds2, mon, mon2, tue, tue2, wed, wed2, thu, thu2, fri, fri2, sat, sat2, sun, sun2

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

        title2 = `title-${random()}`
        addressLocation2 = `madrid`
        addressStNumber2 = `addressStNumber-${random()}`
        addressOther2 = `addressOther-${random()}`
        length2 = 4.5
        width2 = 2.22
        height2 = 2.4
        area2 = 10
        description2 = `description-${random()}`
        price2 = 2
        acceptsBarker2 = 'yes'
        surveillance2 = 'no'
        isCovered2 = 'yes'
        hourStarts2 = '9:00'
        hourEnds2 = '18:00'
        mon2 = 'yes'
        tue2 = 'yes'
        wed2 = 'yes'
        thu2 = 'yes'
        fri2 = 'yes'
        sat2 = false
        sun2 = false

    })

    describe('when user and the toilet post exist', () => {
        beforeEach(() =>
            Promise.all([User.create({ name, surname, email, phone, password }), User.create({ name: name2, surname: surname2, email: email2, phone: phone2, password: password2 })])
                .then(([user, user2]) => {
                    _id = user.id.toString()
                    _id2 = user2.id.toString()
                })
                .then(() => Promise.all([Spot.create({ publisherId: _id, title: title, addressLocation: addressLocation, addressStNumber: addressStNumber, addressOther: addressOther, length: length, width: width, height: height, area: area, description: description, price: price, acceptsBarker: acceptsBarker, surveillance: surveillance, sCovered: isCovered, hourStarts: hourStarts, hourEnds: hourEnds, mon: mon, tue: tue, wed: wed, thu: thu, fri: fri, sat: sat, sun: sun }), Spot.create({ publisherId: _id2, title: title2, addressLocation: addressLocation2, addressStNumber: addressStNumber2, addressOther: addressOther2, length: length2, width: width2, height: height2, area: area2, description: description2, price: price2, acceptsBarker: acceptsBarker2, surveillance: surveillance2, sCovered: isCovered2, hourStarts: hourStarts2, hourEnds: hourEnds2, mon: mon2, tue: tue2, wed: wed2, thu: thu2, fri: fri2, sat: sat2, sun: sun2 }), User.findById(_id), User.findById(_id2)]))
                .then(([spot, spot2, user, user2]) => {
                    _spotId = spot.id.toString()
                    _spotId2 = spot2.id.toString()

                    user.publishedSpots.push(spot)
                    user2.publishedSpots.push(spot2)

                    return Promise.all([user.save(), user2.save()])
                })
                .then(() => { })
        )

        it('should successfully retrieve all spots', () => {
            return findAvailableSpots()
                .then(spots => {
                    expect(spots.length).to.equal(2)
                    expect(spots).to.be.instanceOf(Array)
                    
                    spots.forEach(spot => {
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
                })
                .then(() => { })
        })

    })

    describe('when there are no spots', () => {
        beforeEach(() => Promise.resolve(Spot.deleteMany()).then(() => { }))

        it('should return an empty array if no spots are available to display', () => {

            return findAvailableSpots()
                .then(spots => {
                    expect(spots).to.be.instanceOf(Array)
                    expect(spots.length).to.equal(0)
                })
        })
    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})
