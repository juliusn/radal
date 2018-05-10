const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  emoji: {type: String, default: '🙂'},
  location: {type: [Number]},
  geotags: [{type: mongoose.Schema.ObjectId, ref: 'Geotag'}],
  updated_at: {type: Date, default: Date.now()},
});

UserSchema.statics.findOneOrCreate = function findOneOrCreate(
    condition, doc, callback) {
  const self = this;
  self.findOne(condition, (err, result) => {
    return result ?
        callback(err, result) :
        self.create(doc, (err, result) => {
          return callback(err, result);
        });
  });
};

module.exports = mongoose.model('User', UserSchema);
