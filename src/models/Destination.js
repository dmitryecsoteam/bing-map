const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
     _id: Number,
     latitude: String,
     longitude: String,
     nameEn: String
});

module.exports = mongoose.model('Destination', DestinationSchema, 'destinations');