const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  favaddrId: { type: String },
  curraddrId: { type: String },

});

module.exports = mongoose.model('Users', UserSchema);