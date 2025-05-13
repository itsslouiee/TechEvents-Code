const express = require('express');
const router = express.Router();
const {verifyToken, verifyOrganizer} = require('../middlewares/auth');
const {signup, login, logout, verifyEmail} = require('../controllers/organizerAuthController');
const {changePassword } = require("../controllers/passwordController");
const {getOrganizerProfile, getInfoBase, getEventsOrganizer, getOrganizerSubEv, getAboutOrg, editIntro, editAbout, editOrgLogo, deleteOrganizerProfile} = require("../controllers/organizerController");
const upload = require('../middlewares/upload'); // Importing multer setup
const {getEventDetails, getOrganizerEvents, deleteEvent} = require("../controllers/eventController");


//we got 18 fcts related to the organizer profile (but in seperated routes)

// AUTH
router.post('/signup', upload.single('verificationDoc'), signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', verifyToken, verifyOrganizer, logout);

//Change password 
router.put('/changepassword',verifyToken, verifyOrganizer, changePassword);

// getting the profile info (old fct)
router.get("/profile", verifyToken, verifyOrganizer, getOrganizerProfile);

// get profile fcts separated (new fct)
router.get('/:id/info-base',getInfoBase); 
router.get('/:id/events',getEventsOrganizer);
router.get('/:id/about',getAboutOrg);
router.get('/profile/submitted-events', verifyToken, verifyOrganizer, getOrganizerSubEv);



// getting posted events
router.get("/events", verifyToken, verifyOrganizer, getOrganizerEvents);

// getting event details
router.get('/event/:id', getEventDetails);

// edit routes
router.put("/edit/intro", verifyToken, verifyOrganizer, editIntro);
router.put("/edit/about", verifyToken, verifyOrganizer, editAbout);
router.put("/edit/logo", verifyToken, verifyOrganizer, upload.single('logo'), editOrgLogo);

// delete profile 
router.delete("/delete/my-profile", verifyToken, verifyOrganizer, deleteOrganizerProfile);

//Delete posted events (the only allowed function)
router.delete("/event/:id", verifyToken, verifyOrganizer, deleteEvent);


module.exports = router;