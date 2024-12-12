const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    role: { type: String, enum: ['librarian', 'user'], default: 'user' },
    profile_pic: { type: String },
    requestedBooks: [{
        ebook: { type: mongoose.Schema.Types.ObjectId, ref: 'Ebooks_' },
        status: { type: String, enum: ['pending', 'granted', 'rejected'], default: 'pending' }
    }],
    issuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ebooks_' }],
    feedback: [
        {
            ebook: { type: mongoose.Schema.Types.ObjectId, ref: 'Ebooks_' },
            rating: { type: Number, required: true },
            comment: { type: String, required: true }
        }
    ],
    subscription: { type: String, enum: ["basic", "standard", "premium", "none"], default: "basic" },
    request_available: { type: Number, default: 2 }
});

module.exports = mongoose.model('User', UserSchema);
