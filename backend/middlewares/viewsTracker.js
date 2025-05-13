const Event = require('../models/Event');
const Organizer = require('../models/EventOrganizer');

const trackViews = (model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    await model.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: false } //increment without fetch
    );
  } catch (error) {
    console.error('View tracking failed:', error); 
  }
  next();
};

module.exports = {
  trackEventViews: trackViews(Event),
  trackOrganizerViews: trackViews(Organizer)
};