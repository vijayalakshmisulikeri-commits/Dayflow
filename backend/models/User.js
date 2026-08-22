const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Employee', 'Admin'], default: 'Employee' },
  name: { type: String, trim: true },
  phone: { type: String },
  address: { type: String },

  // 🔒 Email verification
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
