const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const upload = require('../middleware/_multer');
const Student = require('../models/Student');

router.post(
    '/register',
    upload.single("image"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, username, password, email, phone, role } = req.body;

        try {
            const Model = User
            let user = await Model.findOne({ username });

            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            const userFields = {
                name,
                username,
                password,
                email,
                phone,
                role,
            };

            user = new Model(userFields);

            if (req.file) {
                user.profile_pic = req.file.filename;
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    profile_pic: user.profile_pic,
                    role: user.role,
                },
            };
            console.log(payload.user)
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: payload.user,
                        msg: `You have been assigned ${role} role`,
                    });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);



// Login API
router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').exists(),
        check('role', 'Role is required and must be either "librarian" or "user"').isIn(['librarian', 'user']),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, role } = req.body;

        try {
            const Model = User

            let user = await Model.findOne({ username });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    profile_pic: user?.profile_pic,
                    role: user.role,
                    subscription: user?.subscription,
                    request_available: user?.request_available,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, user: payload.user });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


module.exports = router;