const mongoose = require("mongoose");
const Event = require("../models/Event");
const EventOrganizer = require('../models/EventOrganizer');

const getEventDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
  }
  try {
      const event = await Event.findById(id)
          .populate('organizerId', 'organizationName logo');

      if (!event) {
          return res.status(404).json({ error: "Event not found" });
      }

      // Return raw data without formatting
      const response = {
          basicInfo: {
              title: event.eventName,
              organizer: event.organizerId.organizationName,
              organizerLogo: event.organizerId.logo,
              eventLogo: event.logo,
              startDate: event.startDate,
              endDate: event.endDate
          },
          details: {
              description: event.description,
              category: event.category,
              techField: event.techField,
              locationType: event.locationType,
              city: event.city
          },
          registration: {
              deadline: event.deadline,
              cost: event.cost,
              amount: event.amount,
              link: event.eventLink
          },
          prizes: event.prizes, // Raw array of prize strings
          sponsors: event.sponsoredBy, // Raw sponsor objects
          additionalInfo: event.additionalInfo,
          status: event.status
      };

      res.json(response);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};





const getOrganizerEvents = async (req, res) => {
  try {
      const events = await Event.find({ organizerId: req.user.id })
                              .sort({ createdAt: -1 });
      res.status(200).json({
          success: true,
          count: events.length,
          data: events
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          error: error.message
      });
  }
};

// delete posted events 
const deleteEvent = async (req, res) => {
  try {
      const {id} = req.params;

      // 1. Supprimer l'événement s'il appartient à l'organisateur connecté
      const event = await Event.findOneAndDelete({ 
          _id: id, 
          organizerId: req.user.id 
      });

      if (!event) {
          return res.status(404).json({ 
              success: false, 
              error: "Événement non trouvé ou non autorisé" 
          });
      }
      // 2. Décrémenter le compteur de l'organisateur
      try {
          await EventOrganizer.findByIdAndUpdate(
              req.user.id,
              { $inc: { eventCount: -1 } }
          );
      } catch (organizerError) {
          console.error("Erreur lors de la décrémentation de l'organisateur :", organizerError);
          // On continue même si l'update échoue
      }

      // 3. Répondre avec succès
      res.status(200).json({
          success: true,
          message: "Événement supprimé avec succès"
      });

  } catch (error) {
      res.status(500).json({
          success: false,
          error: error.message
      });
  }
};


//export final avec toutes les fonctions
module.exports = {
  getEventDetails,
  getOrganizerEvents,
  deleteEvent
};