const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  userId: String,
  updated: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.statics.findOrCreate = require('find-or-create');

module.exports = mongoose.model('User', UserSchema);
