require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { expect } = require('chai')
const { random } = Math
const acceptBooking = require('./accept-booking')

describe('acceptBooking', () => {

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
    describe('when user already exists', () => {

        beforeEach(() =>
            Promise.all([User.create({ name, surname, email, phone, password }), User.create({ name: name2, surname: surname2, email: email2, phone: phone2, password: password2 })])
                .then(([user, user2]) => {
                    _id = user.id.toString()
                    _id2 = user2.id.toString()
                })
                .then(() => Promise.resolve(Spot.create({ publisherId: _id, title: title, addressLocation: addressLocation, addressStNumber: addressStNumber, addressOther: addressOther, length: length, width: width, height: height, area: area, description: description, price: price, acceptsBarker: acceptsBarker, surveillance: surveillance, sCovered: isCovered, hourStarts: hourStarts, hourEnds: hourEnds, mon: mon, tue: tue, wed: wed, thu: thu, fri: fri, sat: sat, sun: sun })))
                .then(({ id }) => _spotId = id)
                .then(() => Promise.all([User.findByIdAndUpdate(_id, { $push: { publishedSpots: _spotId } }), Spot.findByIdAndUpdate(_spotId, { $push: { bookingCandidates: [_id2] } })]))
                .then(([user, spot]) => {
                    return Promise.all([user.save(), spot.save()])
                })
                .then(() => { })
        )

        it('should succeed on correct user data', () =>
            acceptBooking(_id, _id2, _spotId)
                .then(() => {
                    return Spot.findById(_spotId)
                })
                .then(spot => {
                    expect(spot).to.exist
                    expect(spot.id).to.be.a('string')
                    expect(spot.bookingCandidates).to.have.lengthOf.at.least(0)
                    expect(spot.bookedTo).to.exist
                    expect(spot.bookedTo.toString()).to.equal(_id2)
                })
        )
        
        describe('unhappy paths', () => {
            it('should fail on a non-string user publisherId', () => {
                _id = 9328743289
                _id2 = '23234sfasf'
                _spotId = '32j43b34kb'
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `publisherId ${_id} is not a string`)

                _id = false
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `publisherId ${_id} is not a string`)

                _id = undefined
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `publisherId ${_id} is not a string`)

                _id = []
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `publisherId ${_id} is not a string`)
            })

            it('should fail on a non-string candidateId', () => {
                _id = '23234sfasf'
                _id2 = 9328743289
                _spotId = '32j43b34kb'
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `candidateId ${_id2} is not a string`)

                _id2 = false
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `candidateId ${_id2} is not a string`)

                _id2 = undefined
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `candidateId ${_id2} is not a string`)

                _id2 = []
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `candidateId ${_id2} is not a string`)
            })
            
            it('should fail on a non-string spotId', () => {
                _id = '23234sfasf'
                _id2 = '32j43b34kb'
                _spotId = 9328743289
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)

                _spotId = false
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)

                _spotId = undefined
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)

                _spotId = []
                expect(() => acceptBooking(_id, _id2, _spotId)).to.throw(TypeError, `spotId ${_spotId} is not a string`)
            })

        })
    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})