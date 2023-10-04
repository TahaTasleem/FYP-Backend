const mongoose = require('mongoose');

const relativeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    cell: {
        type: String,
        maxLength: 13,
        required: true,
        unique : true
    },
    alternativeCell: {
        type: String,
        maxLength: 13,
    },
    belongsTo: {                         //riderId
        type:  mongoose.Types.ObjectId,
        required: true
    },
    relation: {
        type: String,
        enum: ['parent', 'guardian', 'sibling', 'children', 'spouse', 'friend'],
        default: 'friend'
    }
});

module.exports = mongoose.model("Relative", relativeSchema);