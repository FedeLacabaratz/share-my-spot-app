const { random } = Math
const { mongoose, models: { User, Spot } } = require('share-my-spot-data')
const { spotDelete } = require('.')
const jwt = require('jsonwebtoken')
import context from './context'

const { env: {
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_JWT_SECRET: TEST_JWT_SECRET
} } = process

describe('spotDelete', () => {

    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Spot.deleteMany()]))
    )

    let name, surname, email, phone, password, _spotId, title, description, addressLocation, addressStNumber, addressOther, hourStarts, hourEnds, mon, tue, wed, thu, fri, sat, sun, length, width, height, area, price, acceptsBarker, surveillance, isCovered

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
        hourStarts = 9
        hourEnds = 18
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
                
        it('should succeed on correct and valid and right data', () => {
            Spot.findById(_spotId),
            User.findById(id)
                .then((user) => {
                    expect(user.id).toBeDefined()
                })
                .then(() => spotDelete(id, _spotId)
                    .then(() => User.findById(id).lean())
                    .then((user) => {
                        expect(user).toBeDefined()
                        expect(user.publishedSpots).toBeUndefined()
                    })
                )
        })

        it('should fail if the Spot does not exist', () => {
            _spotId = `${_spotId}-wrong`
            spotDelete(id, _spotId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).to.exist

                    expect(message).toBe(`Spot with name ${_spotId} not found`)

                })
        })

    })

    afterAll(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(() => mongoose.disconnect()))
})