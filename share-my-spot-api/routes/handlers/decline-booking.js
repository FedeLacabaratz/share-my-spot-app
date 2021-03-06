const { declineBooking } = require('../../logic')
const { NotFoundError } = require('share-my-spot-errors')

module.exports = (req, res) => {
    const { payload: { sub: publisherId }, params: {candidateId, spotId} } = req

    try {
        declineBooking(publisherId, candidateId, spotId)
            .then(() =>
                res.status(200).json()
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

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}