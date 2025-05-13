const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email:{type: String, required: true, unique: true},
	password: {type: String, required: true},
	profilePic: {type: String},
	role: { type: String, default: 'admin'},
	otp: {type: String, default: null},
	otpExpiry: {type: Date}
},{
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;