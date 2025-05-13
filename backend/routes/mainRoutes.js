const express = require('express');
const router = express.Router();
const {trendingOrganizers, seeAllOrganizers, trendingEvents, latestEvents, getAllEvents, getEventsByCategory} = require('../controllers/mainController');

//fetch 6 upcoming events based on deadline (latest)
router.get('/latest-events', latestEvents);

//fetching 5 trending organizers
router.get('/trending-organizers', trendingOrganizers);

//see all organizers
router.get('/organizers/all', seeAllOrganizers);

//fetching 6 trending events
router.get('/trending-events', trendingEvents);

//get all events f l MORE page based on views or deadline
router.get('/events/all', getAllEvents);

//get events by category
router.get('/events/category/:category', getEventsByCategory);


module.exports = router;
