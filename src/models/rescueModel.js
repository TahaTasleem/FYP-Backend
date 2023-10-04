const mongoose = require('mongoose');

const rescueSchema = new mongoose.Schema({
    credentials: {
        userName: {             //organization's username
            type: String,
            maxLength: 25,
            required: true,
            unique : true,
            immutable: true
        },
        password: {
            type: String,
            maxLength: 127,
            required: true,
            select: false
        },
    },
    organizationName: {
        type: String,
        required: true,
    },
    createdAt: {                        //organizationRegisteredAt
        type: Date,
        required: true
    },
    cell: {
        type: String,
        maxLength: 11,
        required: true
    },
    acceptedDeliveries: {               //how many times the staff accepted to depart ambulance
        type: Number,
        default: 0
    },
    deniedDeliveries: {
        type: Number,
        default: 0
    },
    resetPasswordToken: {
        type: String
    }
});

module.exports = mongoose.model("Rescue", rescueSchema);