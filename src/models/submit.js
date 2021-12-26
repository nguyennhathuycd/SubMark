const mongoose = require('mongoose');

const submitSchema = new mongoose.Schema({
    images: {
        type: String,
        required: true,
    },
    studentID: {
        type: String,
    },
    timeSubmission: {
        type: Date,
        default: () => Date.now(),
    },
});

module.exports = mongoose.model('submissions', submitSchema);