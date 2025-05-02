require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pci_vendors', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// File Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const User = require('./models/User');
        const user = new User({ email, password, name });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = require('./models/User');
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = user.generateAuthToken();
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/vendors', upload.fields([
    { name: 'aoc_document', maxCount: 1 },
    { name: 'roles_responsibilities', maxCount: 1 }
]), async (req, res) => {
    try {
        const Vendor = require('./models/Vendor');
        const vendor = new Vendor({
            ...req.body,
            user: req.user._id,
            aoc_document_path: req.files.aoc_document?.[0]?.filename,
            roles_responsibilities_path: req.files.roles_responsibilities?.[0]?.filename
        });
        await vendor.save();
        res.status(201).json(vendor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/vendors', async (req, res) => {
    try {
        const Vendor = require('./models/Vendor');
        const vendors = await Vendor.find({ user: req.user._id });
        res.json(vendors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/vendors/:id/request-aoc', async (req, res) => {
    try {
        const Vendor = require('./models/Vendor');
        const vendor = await Vendor.findById(req.params.id);
        
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: vendor.contact_email,
            subject: 'Request for Updated AOC and Roles & Responsibilities',
            text: `Dear ${vendor.contact_name},\n\nWe kindly request updated copies of your AOC and Roles & Responsibilities documentation.\n\nPlease provide these documents at your earliest convenience.\n\nBest regards,\nPCI Compliance Team`
        };

        await transporter.sendMail(mailOptions);
        vendor.last_aoc_request_date = new Date();
        await vendor.save();

        res.json({ message: 'AOC request sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 