const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    credentials: {
        userName: {
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
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        maxLength: 127,
        required: true,
    },
    vehicleRegistrationNumber: {
        type: String,
        maxLength: 7,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['commercial', 'private'],
        default: 'private',
        required: true
    },
    createdAt: {                        //userRegisteredAt
        type: Date,
        required: true
    },
    diseases: [
        {
            name: {
                type: String,
                required: true
            },
            diagnosedAt: {
                type: Date
            }
        },
    ],
    accidentHistory : [
        {
            location: {
                type: String,
                required: true
            },
            reportedAt: {
                type: Date,
                required: true
            }
        }
    ],
    NIC: {
        type: String,
        maxLength: 14,
        required: true
    },
    cell: {
        type: String,
        maxLength: 11,
        required: true
    },
    resetPasswordToken: {
        type: String,
        select: false
    }
});

module.exports = mongoose.model("Rider", riderSchema);