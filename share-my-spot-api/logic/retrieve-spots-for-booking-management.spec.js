require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { expect } = require('chai')
const { random } = Math
const retrieveSpotsForBookingManagement = require('./retrieve-spots-for-booking-management')


describe('retrieveSpotsForBookingManagement', () => {
    before(() =>
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
            retrieveSpotsForBookingManagement(_id)
                .then(spots => {
                    
                    expect(spots.length).to.equal(1)
                    expect(spots).to.be.instanceOf(Array)
                    expect(spots[0].id).to.equal(_spotId)
                    expect(spots[0].publisherId.id).to.equal(_id)
                    expect(spots[0].bookingCandidates[0]).to.equal(_id2)
                })
                .then(() => { })
        })

        describe('when the user does not exist', () => {
            beforeEach(() => User.deleteMany().then(() => { }))

            it('should fail to post a comment if the user does not exist', () =>
                retrieveSpotsForBookingManagement(_id)
                    .then(() => { throw new Error('should not reach this point') })
                    .catch(({ message }) => {
                        expect(message).not.to.be.undefined
                        expect(message).to.equal(`user with id ${_id} not found`)
                    })
                    .then(() => { })
            )
        })

        describe('unhappy paths', () => {
            it('should fail on a non-string user id', () => {
                __id = 9328743289
                expect(() => retrieveSpotsForBookingManagement(__id)).to.throw(TypeError, `id ${__id} is not a string`)

                __id = false
                expect(() => retrieveSpotsForBookingManagement(__id)).to.throw(TypeError, `id ${__id} is not a string`)

                __id = undefined
                expect(() => retrieveSpotsForBookingManagement(__id)).to.throw(TypeError, `id ${__id} is not a string`)

                __id = []
                expect(() => retrieveSpotsForBookingManagement(__id)).to.throw(TypeError, `id ${__id} is not a string`)
            })
        })

    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})