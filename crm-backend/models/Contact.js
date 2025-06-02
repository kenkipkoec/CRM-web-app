const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  company: String,
  notes: String,
}, { timestamps: true });
module.exports = mongoose.model('Contact', ContactSchema);