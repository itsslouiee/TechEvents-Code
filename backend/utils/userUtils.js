const Admin = require('../models/Admin');
const Organizer = require('../models/EventOrganizer');

const findUserByEmail = async (email) => { 
    const user = await Organizer.findOne({ email }) || await Admin.findOne({ email }); 
    return user; 
}; 

module.exports = {findUserByEmail};