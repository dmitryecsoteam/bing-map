const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
     _id: Number,
     latitude: Number,
     longitude: Number
});

module.exports = mongoose.model('Destination', DestinationSchema, 'destinations');