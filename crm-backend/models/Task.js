const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  completed: Boolean,
  dueDate: String,
  category: String,
  recurrence: String,
  notes: String,
  priority: String,
}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);