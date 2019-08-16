const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OriginSchema = new Schema({
     _id: Number,
     latitude: String,
     longitude: String,
     nameEn: String
});

module.exports = mongoose.model('Origin', OriginSchema, 'origins');