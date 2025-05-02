const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    service_provider_name: {
        type: String,
        required: true
    },
    pci_requirements: {
        type: String,
        required: true
    },
    services_provided: {
        type: String,
        required: true
    },
    aoc_expiration_date: {
        type: Date,
        required: true
    },
    contact_name: {
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        required: true
    },
    aoc_document_path: String,
    roles_responsibilities_path: String,
    last_aoc_request_date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vendor', vendorSchema); 