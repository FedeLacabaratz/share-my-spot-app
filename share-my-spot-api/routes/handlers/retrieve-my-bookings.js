const { retrieveMyBookings } = require('../../logic')
const {  NotFoundError } = require('share-my-spot-errors')

module.exports = (req, res) => {
    debugger
    const { payload: { sub: id } } = req

    try {
        retrieveMyBookings(id)
            .then(spot =>
                res.status(200).json(spot)
            )
            .catch(({ message }) =>
                res
                    .status(401)
                    .json({
                        error: message
                    })
            )
    } catch (error) {
        let status = 400

        switch (true) {
            case error instanceof NotFoundError:
                status = 404 // not found
                break
        }

        const {message} = error

        res
            .status(status)
            .json({ 
                error: message
            })
    }
}