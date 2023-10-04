const mongoose = require('mongoose');

const exceptionSchema = new mongoose.Schema({
    statusCode: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    loggedAt:{                  
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Exception", exceptionSchema);