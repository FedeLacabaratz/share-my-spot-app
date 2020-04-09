const { random } = Math
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { addSpot } = require('.')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('addSpot', () => {
    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Spot.deleteMany()]))
    )

    let name, surname, email, phone, password, title, description, addressLocation, addressStNumber, addressOther, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun, length, width, height, area, price, acceptsBarker, surveillance, isCovered

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        phone = 666555
        password = `password-${random()}`

        title = `title-${random()}`
        addressLocation = `addressLocation-${random()}`
        addressStNumber = `addressStNumber-${random()}`
        addressOther = `addressOther-${random()}`
        length = 4.5
        width = 2.22
        height = 2.4
        area = 10
        description = `description-${random()}`
        price = 2
        acceptsBarker = 'yes'
        surveillance = false
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
        let id
        beforeEach(() =>
            User.create({ name, surname, email, phone, password })
                .then(({ id }) => context.token = jwt.sign({ sub: id }, TEST_JWT_SECRET))
        )

        it('should succeed on correct data', () => {
            addSpot(id, title, addressLocation, addressStNumber, addressOther, length, width, height, area, description, price, acceptsBarker, surveillance, isCovered, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun)
                .then(() =>
                    Promise.all([
                        User.findById(id),
                        Spot.findOne({ publisherId: _id, title })
                    ])
                )
                .then(([user, spot]) => {

                    spot.acceptsBarker === true ? acceptsBarker = true : acceptsBarker = false
                    spot.surveillance === true ? surveillance = true : surveillance = false
                    spot.isCovered === true ? isCovered = true : isCovered = false
                    spot.mon === true ? mon = true : mon = false
                    spot.tue === true ? tue = true : tue = false
                    spot.wed === true ? wed = true : wed = false
                    spot.thu === true ? thu = true : thu = false
                    spot.fri === true ? fri = true : fri = false
                    spot.sat === true ? sat = true : sat = false
                    spot.sun === true ? sun = true : sun = false

                    expect(user).to.exist
                    expect(user.publishedSpots).toContain(spot._id)
                    expect(spot).to.exist
                    expect(spot.title).toEqual(title)
                    expect(spot.addressLocation).toEqual(addressLocation)
                    expect(spot.addressStNumber).toEqual(addressStNumber)
                    expect(spot.addressOther).toEqual(addressOther)
                    expect(spot.length).toEqual(length)
                    expect(spot.width).toEqual(width)
                    expect(spot.height).toEqual(height)
                    expect(spot.area).toEqual(area)
                    expect(spot.description).toEqual(description)
                    expect(spot.price).toEqual(price)
                    expect(spot.acceptsBarker).toEqual(acceptsBarker)
                    expect(spot.surveillance).toEqual(surveillance)
                    expect(spot.isCovered).toEqual(isCovered)
                    expect(spot.hourStarts).toEqual(hourStarts)
                    expect(spot.hourEnds).toEqual(hourEnds)
                    expect(spot.mon).toEqual(mon)
                    expect(spot.tue).toEqual(tue)
                    expect(spot.wed).toEqual(wed)
                    expect(spot.thu).toEqual(thu)
                    expect(spot.fri).toEqual(fri)
                    expect(spot.sat).toEqual(sat)
                    expect(spot.sun).toEqual(sun)
                    expect(spot.publisherId.toString()).toEqual(_id)
                })
            })
    })

    afterAll(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})