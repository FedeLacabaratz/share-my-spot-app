const express = require('express')
const fs = require('fs')
const { retrieveSpotPhoto } = require('../../logic')

module.exports = async (req, res) => {
    const { params: { spotId } } = req
    
    const stream = await retrieveSpotPhoto(spotId) 

    res.setHeader('Content-Type', 'image/jpeg')

    return stream.pipe(res)

}