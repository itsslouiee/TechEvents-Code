const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
    organizationName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    verificationDoc: { type: String, required: true },
    logo: { type: String }, 
    website: { type: String}, 
    description: { type: String},
    contacts:{
        phone: { type: String },
        email: { type: String }, 
    },
    socialMedia: {
        linkedin: { type: String},
        instagram: { type: String},
        facebook: { type: String}
    },
    views: { type: Number, default: 0 },
    eventCount: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending"
    },
    role: { type: String, default: 'organizer' },
    otp: {type: String, default: null},
    otpExpiry: {type: Date},
    // isVerified: { type: Boolean, default: false }
},{
    timestamps: true
});


const EventOrganizer = mongoose.model("EventOrganizer", organizerSchema);

module.exports = EventOrganizer;
