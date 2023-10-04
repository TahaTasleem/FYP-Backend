const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    riderId: {                          
        type:  mongoose.Types.ObjectId,
        required: true
    },
    createdAt: {                  
        type: Date,
        required: true
    },
    accidentLocation: {                             
        type: String,
        required: true
    },
    rescuedBy: [                         //organizations which accepted the request for rescue
        {
            rescueId: {
                type: mongoose.Types.ObjectId
            },
            organizationName: {
                type: String
            },
            rescuedAt: {                       
                type: Date
            }
        },
    ],
    status: {
        type: String,
        enum: ['inactive', 'active'],
        default: 'inactive'
    },
    
});

module.exports = mongoose.model("Report", reportSchema);