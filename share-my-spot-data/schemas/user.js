const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    created: { type: Date, required: true, default: Date.now },
    authenticated: { type: Date },
    publishedSpots: [{ type: ObjectId, ref: 'Spot' }]
})