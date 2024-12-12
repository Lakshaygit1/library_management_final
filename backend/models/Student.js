const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  reg_no: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  phone: {
    type: String,
    required: true,
    match: [
      /^\+?\d{10,15}$/,
      'Please provide a valid phone number (10-15 digits, optional + prefix)',
    ],
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  department: {
    type: String,
    required: false,
    trim: true,
  },
  semester: {
    type: Number,
    required: false,
    min: 1,
    max: 8,
  },
  role: { type: String, enum: ['librarian', 'user'], default: 'user' },
  requestedBooks: [{
    ebook: { type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' },
    status: { type: String, enum: ['pending', 'granted', 'rejected'], default: 'pending' }
  }],
  issuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' }],
  profile_pic: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
