const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  contact: String,
  password: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);