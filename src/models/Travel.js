const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelSchema = new Schema({
    origin: Number,
    destination: Number,
    date: String,
    carDistance: Number,
    carDuration: Number
    //carDistance: { type: Number, set: (v) => { return Math.round(v)}},
    //carDuration: { type: Number, set: (v) => { return Math.round(v)}}
});

TravelSchema.statics.findMaxOrigin = function findMaxOrigin() {
    return this.findOne().select({ origin: 1 }).sort({ origin: -1 });
}

TravelSchema.statics.findMaxDestination = function findMaxDestination() {
    return this.findOne().select({ destination: 1 }).sort({ destination: -1 });
}

TravelSchema.statics.existsWithoutCar = function existsWithoutCar(origin, destination) {
    return this.findOne({ origin, destination, $or: [{ carDistance: null }, { carDuration: null }] }).select({ _id: 1 });
}

module.exports = mongoose.model('Travel', TravelSchema, 'travels');