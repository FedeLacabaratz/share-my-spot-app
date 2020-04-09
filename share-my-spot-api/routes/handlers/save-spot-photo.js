const express = require('express')
const fs = require('fs')
const { saveSpotPhoto } = require('../../logic')
const Busboy = require('busboy')

module.exports = async (req, res) => {
    const { payload: { sub: userId }, params: { spotId } } = req
    
    
    const busboy = new Busboy({ headers: req.headers })
    
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        filename = 'spot01.jpg'
        
        await saveSpotPhoto(userId, spotId, file, filename)
        
    })

    busboy.on('finish', () => {
        res.end()
    })

    return req.pipe(busboy)

}
