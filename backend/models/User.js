const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  budgetLimit: {
    type: Number,
    default: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  billDueDate: {
    type: Date
  },
  providerName: {
    type: String,
    default: "National Grid"
  }
});

module.exports = mongoose.model('User', UserSchema);
