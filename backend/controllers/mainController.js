const Organizer = require('../models/EventOrganizer');
const Event = require('../models/Event');

// getting 5 organizers with most views
const trendingOrganizers = async (req, res) => {
  try {
    const trendingOrganizers = await Organizer.find({ status: 'approved' })
      .sort({ views: -1 })
      .limit(5)
      .select('organizationName logo views eventCount')
      .lean();

    return res.status(200).json({
      success: true,
      trendingOrganizers 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch trending organizers'
    });
  }
};

// see all organizers list with sorting option (Alph name, event count, views)
const seeAllOrganizers = async (req, res) => {
  try {
    const {sortBy = 'name'} = req.query; //default by name
    
    const sortOptions = {
      name: { organizationName: 1 },       // A-Z
      views: { views: -1 },                // Highest views first
      events: { eventCount: -1 },          // Highest nbr of events first
    };

    //validating sortBy input
    const isValidSort = Object.keys(sortOptions).includes(sortBy);
    const sortCriteria = isValidSort ? sortOptions[sortBy] : sortOptions.name;

    const allOrganizers = await Organizer.find({ status: 'approved' })
      .sort(sortCriteria)
      .select('organizationName logo views eventCount')
      .lean();

    return res.status(200).json({
      success: true,
      sortBy,
      organizers: allOrganizers,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch organizers',
    });
  }
};

//Most popular
const trendingEvents = async (req, res) => {
  try {
    const trendingEvents = await Event.find({ status: 'approved' })
      .populate('organizerId', 'logo')
      .sort({ views: -1 })
      .limit(6)
      .select('eventName logo deadline locationType city prizes startDate endDate')
      .lean();

    //processing
    const formattedEvents = trendingEvents.map(event => ({
      name: event.eventName,
      eventLogo: event.logo, // Event logo
      organizerLogo: event.organizerId?.logo || null, // Organizer logo
      deadline: event.deadline,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.locationType === "Online" ? "Online" : event.city, // "Online" or city
      prize: event.prizes[0] || null, // first prize only
    }));

    res.status(200).json({
      success: true,
      trendingEvents: formattedEvents
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

//Latest events 
const latestEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      status: "approved",
      deadline: { $gte: new Date() } //we are ordering them using DEADLINE
    })
    .populate('organizerId', 'logo') //organizer logo 
    .sort({ deadline: 1 }) // Soonest deadline first
    .limit(6)
    .select('eventName logo deadline locationType city prizes startDate endDate')
    .lean();

    const upcomingEvents = events.map(event => ({
      name: event.eventName,
      eventLogo: event.logo,
      organizerLogo: event.organizerId?.logo || null,
      deadline: event.deadline, //frontend will handle the formats here
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.locationType === "Online" ? "Online" : event.city,
      prize: event.prizes[0] || null // first prize only
    }));

    res.json({
      success: true,
      events: upcomingEvents
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to load upcoming events"
    });
  }
};

// get all events in the more page 
const getAllEvents = async (req, res) => {
  try {
    const { sortBy = 'views' } = req.query; // default 

    const sortOptions = {
      views: { views: -1},   
      deadline: { deadline: -1},
    };

    // goes to views if invalid sortBy
    const sortKey = sortOptions[sortBy] ? sortBy : 'views';
    const sortCriteria = sortOptions[sortKey];

    const events = await Event.find({ status: 'approved' })
      .populate('organizerId', 'logo')
      .sort(sortCriteria)
      .select('eventName logo deadline locationType city prizes startDate endDate views category techField')
      .lean();

    // Format response (exclude views unless needed)
    const formattedEvents = events.map(event => ({
      name: event.eventName,
      eventLogo: event.logo,
      organizerLogo: event.organizerId?.logo || null,
      deadline: event.deadline,
      location: event.locationType === "Online" ? "Online" : event.city,
      prize: event.prizes[0] || null,
      startDate: event.startDate,
      endDate: event.endDate,
      category: event.category,
      techField: event.techField
    }));

    res.status(200).json({
      success: true,
      count: formattedEvents.length,
      events: formattedEvents,
      sortBy: sortKey // returns the used sort method
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

// get events by category 
const getEventsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const events = await Event.find({ 
            category: category,
            status: "approved" 
        }).populate('organizerId', 'organizationName logo');
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: "Erreur serveur" });
    }
};

module.exports = { trendingOrganizers, trendingEvents, latestEvents, seeAllOrganizers, getAllEvents, getEventsByCategory};