const express = require('express');
const router = express.Router();
const { trackOrganizerViews, trackEventViews } = require("../middlewares/viewsTracker");
const {getPublicOrganizerProfile} = require("../controllers/organizerController");
const {getEventDetails} = require("../controllers/eventController");

// getting public profile of the organizer & tracking the profile views
router.get("/organizer/:id", trackOrganizerViews, getPublicOrganizerProfile);

//getting events details & tracking the event views 
router.get('/event/:id', trackEventViews, getEventDetails);

module.exports = router;