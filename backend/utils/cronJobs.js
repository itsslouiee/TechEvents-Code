const cron = require('node-cron');
const Organizer = require('../models/EventOrganizer');
const Event = require('../models/Event');

const cronJobs = () => {
  //At midnight (00:00) on the 1st day of every month reset views
  cron.schedule('0 0 1 * *', async () => {
    //minute hour day-of-month month day-of-week
    try {
      await Organizer.updateMany({}, { $set: { views: 0 } });
      console.log('Organizer views reset completed');

      await Event.updateMany({}, { $set: { views: 0 } });
      console.log('Event views reset completed');

    } catch (error) {
      console.error('Monthly reset failed:', error);
    }
  });

  // Here other cron jobs if needed
};

module.exports = cronJobs;