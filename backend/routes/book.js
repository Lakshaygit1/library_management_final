const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Section = require('../models/Section');
const Ebooks = require('../models/Ebook1');
const upload = require('../middleware/_multer');


// Ensure the user is a librarian
const librarianAuth = (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

router.get("/ebooks", auth, async (req, res) => {
    try {
        const { query } = req.query
        let ebooks = []
        if (query) {
            ebooks = await Ebooks.find({
                $or: [
                    { name: { $regex: query } },
                ]
            }).populate("book_id name authors available cover_path section");
        }
        else {
            ebooks = await Ebooks.find().populate("book_id name authors available cover_path section");
        }
        res.json(ebooks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
]);


router.post('/ebooks', auth, librarianAuth, uploadFields, async (req, res) => {
    const { book_id, name, authors, content, section } = req.body;

    if (!book_id || !name || !authors || !content || !section) {
        return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    try {
        let sectionExists = await Section.findById(section);
        if (!sectionExists) {
            return res.status(400).json({ msg: 'Section does not exist' });
        }

        let ebookExists = await Ebooks.findOne({ book_id });
        if (ebookExists) {
            return res.status(400).json({ msg: 'An e-book with the same name already exists' });
        }

        const ebookData = {
            book_id,
            name,
            authors,
            content,
            section,
        };

        if (req.files['image']) {
            ebookData.cover_path = req.files['image'][0].filename;
        }
        if (req.files['pdf']) {
            ebookData.pdf_path = req.files['pdf'][0].filename;
        }

        let ebook = new Ebooks(ebookData);
        await ebook.save();

        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post("/ebooks/:id/request", auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const ebook = await Ebooks.findById(req.params.id);

        if (!ebook) {
            return res.status(404).json({ msg: "E-book not found" });
        }

        if (ebook.issuedTo && ebook.issuedTo.toString() !== userId) {
            return res
                .status(400)
                .json({
                    msg: "Book is already assigned to another user, Please try again later",
                });
        }

        const user = await User.findById(userId);
        const isAlreadyAssigned = user.issuedBooks.some(
            (issuedBook) => issuedBook.toString() === ebook._id.toString()
        );

        if (isAlreadyAssigned) {
            return res.status(400).json({ msg: "Book is already assigned to you" });
        }
        const existingRequest = user.requestedBooks.find(
            (request) => request.ebook.toString() === ebook._id.toString()
        );

        if (existingRequest) {
            return res
                .status(400)
                .json({ msg: "You have already requested this e-book" });
        }

        if (user.requestedBooks.length >= user.request_available) {
            return res
                .status(403)
                .json({ msg: `You have already requested ${user.request_available} e-books` });
        }

        user.requestedBooks.push({ ebook: ebook._id, status: "pending" });

        await user.save();

        res.json({ msg: "E-book requested successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



router.put('/ebooks/:id', auth, librarianAuth, upload.single("image"), upload.single('pdf'), async (req, res) => {
    const { book_id, name, content, authors, section } = req.body;
    try {
        let ebook = await Ebooks.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'Ebook not found' });
        }
        if (section) {
            let sectionExists = await Section.findById(section);
            if (!sectionExists) {
                return res.status(400).json({ msg: 'Section does not exist' });
            }
        }
        console.log(req.file)
        if (req.file) {
            ebook.cover_path = req.file.filename;
        }

        ebook.book_id = book_id || ebook.book_id;
        ebook.name = name || ebook.name;
        ebook.content = content || ebook.content;
        ebook.authors = authors || ebook.authors;
        ebook.section = section || ebook.section;
        await ebook.save();
        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/ebooks/:id', auth, librarianAuth, async (req, res) => {
    try {
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid ebook ID' });
        }

        const ebook = await Ebooks.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'Ebook not found' });
        }

        if (ebook.issuedTo) {
            return res.status(400).json({ msg: 'Ebook is granted to a user' });
        }

        await Ebooks.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Ebook removed' });
    } catch (err) {
        console.error('Error deleting ebook:', err.message);
        res.status(500).send('Server error');
    }
});



module.exports = router