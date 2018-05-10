const mongoose = require('mongoose');

const GeotagSchema = new mongoose.Schema({
  creator: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  message: {type: String, required: true},
  location: {type: [Number], required: true},
  emoji: String,
  updated_at: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('Geotag', GeotagSchema);
