const { findAvailableSpots } = require('../../logic')
const {  ContentError } = require('share-my-spot-errors')

module.exports = (req, res) => {
    const  { query } = req
    
    try {
        findAvailableSpots(query)
            .then(spots =>
                res.status(200).json(spots)
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
            case error instanceof ContentError:
                status = 406 // not allowed
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