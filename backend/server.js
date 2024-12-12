const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Enable CORS for all requests
app.use(cors());

// Init Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: false }))

// Define Routes
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/librarian', require('./routes/librarian'));
app.use('/api/user', require('./routes/user'));
app.use('/api/book', require('./routes/book'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
