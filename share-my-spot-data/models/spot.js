const mongoose = require('mongoose')
const { spot } = require('../schemas')

module.exports = mongoose.model('Spot', spot)