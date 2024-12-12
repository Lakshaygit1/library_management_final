const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    book_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    authors: { type: [String], required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    available: { type: Boolean, default: true },
    cover_path: { type: String, required: false },
});

module.exports = mongoose.model('Ebook', BookSchema);
