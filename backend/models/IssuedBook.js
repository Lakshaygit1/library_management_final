const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ebook',
        required: true,
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['Issued', 'Returned', 'Overdue', 'Requested'],
        default: 'Issued',
    },
}, { timestamps: true });

module.exports = mongoose.model('IssuedBook', issuedBookSchema);
