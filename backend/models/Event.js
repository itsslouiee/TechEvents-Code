const mongoose = require("mongoose");

	
const eventSchema = new mongoose.Schema({
	eventName: {type: String, required: true},
    organizerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EventOrganizer',
        required: true 
    },
    description: { type: String, required: true },
    logo: {type: String},
    category: {
        type: [String],
        enum: [
            "Hackathon",
            "CTF",
            "Datathon",
            "Conference",
            "Bootcamp",
            "Startup & Innovation",
            "Coding Competition",
            "Other"
        ],
        required: true,
    },
    techField: {
        type: [String],
        enum: [
            "Artificial Intelligence",
            "Cybersecurity",
            "Blockchain",
            "Web Development",
            "Mobile Development",
            "Data Science",
            "Cloud Computing",
            "Software Engineering",
            "Game Development",
            "Embedded Systems",
            "Robotics",
            "Internet of Things",
            "DevOps",
            "Big Data",
            "Quantum Computing",
            "Augmented & Virtual Reality",
            "Bioinformatics",
            "Startup & Entrepreneurship",
            "Other"
        ]
    },
    deadline: { type: Date, required: true }, // for registration 
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    prizes: { type: [String], default: [] },

    cost: { type: String, enum: ["Free", "Paid"], required: true },
    amount: { type: Number, default: 0 },

 	locationType: { type: String, enum: ["Online", "Onsite"], required: true },
    city: { type: String, default: null}, // Only needed if Onsite

	sponsoredBy: { type: [{ sponsorName: String, sponsorLogo: String }], default: [],_id: false },// an array of sponsor objects

    eventLink: { type: String, required: true}, // Website or registration form

    verificationDoc: {type: String, required: true},

    additionalInfo: { type: String }, // if they want to add anything
    views: { type: Number, default: 0},
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending"
    }
},
{
	timestamps: true
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;