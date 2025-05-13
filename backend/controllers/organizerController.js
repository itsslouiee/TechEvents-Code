const mongoose = require('mongoose');
const EventOrganizer = require("../models/EventOrganizer");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../utils/uploadHelper");


// i think we should do get about and get intro separated?
exports.getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await EventOrganizer.findById(req.user.id) // Fix: Changé ici
      .select("-password");

    if (!organizer) {
      return res.status(404).json({ 
        success: false, 
        error: "Organisateur non trouvé" 
      });
    }

    res.json({ success: true, data: organizer });
  } catch (error) {
    console.error(error); // Ajout du log d'erreur
    res.status(500).json({ 
      success: false, 
      error: error.message // Meilleure gestion d'erreur
    });
  }
};

// les visiteur ad wayin le profil n l`organisateur 
// to get the intro part of the profile
exports.getInfoBase = async (req, res) => {
  try {
      // Récupère l'organisateur 
      const organizer = await EventOrganizer.findById(req.params.id)
          .select('organizationName email location logo');

      if (!organizer) {
          return res.status(404).json({ error: "Organisateur non trouvé" });
      }

      
      res.json({
          organizationName: organizer.organizationName,
          email: organizer.email,
          location: organizer.location,
          logo: organizer.logo
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// tagi just ad arr les evnmts n l´organisateur
// posted events 
exports.getEventsOrganizer = async (req, res) => {
  try {
      const organizerId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(organizerId)) {
          return res.status(400).json({ error: "ID d'organisateur invalide" });
      }

      const events = await Event.find({ organizerId })
          .populate('organizerId', 'logo') // Pour le logo de l'organisateur
          .select('eventName logo startDate deadline location prizes')
          .sort({ startDate: 1 });

      
      const formattedEvents = events.map(event => ({
          eventName: event.eventName,
          eventLogo: event.logo,
          organizerLogo: event.organizerId.logo,
          date: event.startDate,
          deadline: event.deadline,
          location: event.location,
          prize: event.prizes[0] 
      }));

      res.json({
          success: true,
          data: formattedEvents
      });

  } catch (error) {
      res.status(500).json({ 
          success: false, 
          error: "Erreur lors de la récupération des événements" 
      });
  }
};

//get submitted events of the organizer
exports.getOrganizerSubEv = async (req, res) => {
  try {
      // Récupère l'ID de l'organisateur connecté
      const organizerId = req.user.id;

      // Vérifie que l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(organizerId)) {
          return res.status(400).json({ 
              success: false, 
              error: "ID d'organisateur invalide" 
          });
      }

      // Récupère l'organisateur et ses événements
      const organizer = await EventOrganizer.findById(organizerId)
          .select('organizationName email');
      
      const events = await Event.find({ organizerId })
          .select('eventName category status');

      if (!organizer) {
          return res.status(404).json({ 
              success: false, 
              error: "Organisateur non trouvé" 
          });
      }
      const response = {
          organizer: {
              name: organizer.organizationName,
              email: organizer.email
          },
          events: events.map(event => ({
              name: event.eventName,
              category: event.category,
              status: event.status
          }))
      };

      res.json({
          success: true,
          data: response
      });

  } catch (error) {
      res.status(500).json({ 
          success: false, 
          error: error.message 
      });
  }
};

//get about part of the profile
exports.getAboutOrg = async (req, res) => {
  try {
      const organizer = await EventOrganizer.findById(req.params.id)
          .select('description email contacts.phone website socialMedia');

      if (!organizer) {
          return res.status(404).json({ error: "Organizer not found" });
      }

      res.json({
          description: organizer.description,
          email: organizer.email,
          phone: organizer.contacts?.phone,
          website: organizer.website,
          socialMedia: organizer.socialMedia
      });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.editIntro = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ["organizationName", "contacts", "location"];
    const isValidUpdate = Object.keys(updates).every(field => allowedUpdates.includes(field));
    const organizer = await EventOrganizer.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ 
      success: true, 
      message: "Intro edited",
      data: organizer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "fail to edit Intro" 
    });
  }
};
//

exports.editAbout = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ["description", "contacts", "website", "socialMedia"];
    const isValidUpdate = Object.keys(updates).every(field => allowedUpdates.includes(field));
    const organizer = await EventOrganizer.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ 
      success: true, 
      message: "about edited",
      data: organizer 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: "fail to edit about" 
    });
  }
};

exports.editOrgLogo = async (req, res) => {
  try {
    
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No logo file uploaded'
      });
    }
    
    // Validate image type
    const isImage = req.file.mimetype.startsWith('image/'); 
    if (!isImage) {
      return res.status(400).json({
        success: false,
        error: 'Only image files are allowed'
      });
    }
    
    // Upload to cloud storage
    const logoUrl = await uploadToCloudinary(req.file, "TechEvents/Orglogos", "image");
    
    // Update organizer in DB
    const organizer = await EventOrganizer.findByIdAndUpdate(
      req.user.id,
      { logo: logoUrl },
      { new: true }
    );
    
    // Return success response
    return res.status(200).json({
      success: true,
      data: { logo: logoUrl },
      message: 'Logo updated successfully'
    });
    
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: 'Error changing logo', 
      message: err.message 
    });
  }
};

exports.deleteOrganizerProfile = async (req, res) => {
  try {
    await EventOrganizer.findByIdAndDelete(req.user.id); // Fix: Changé ici
    await Event.deleteMany({ organizerId: req.user.id });

    res.json({ 
      success: true, 
      message: "Compte organisateur supprimé" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// les visiteur ad wayin le profil n l`organisateur 
exports.getPublicOrganizerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: "ID d'organisateur invalide" 
      });
    }
    // 2. Récupération de l'organisateur approuvé
    const organizer = await EventOrganizer.findOne({
      _id: id,
      status: 'approved'
    })
    .select('-password -verificationDoc -otp -__v')
    .lean();

    if (!organizer) {
      return res.status(404).json({ 
        success: false,
        error: "Organisateur non trouvé ou non approuvé" 
      });
    }

    // 3. Récupération de TOUS les événements approuvés (nouveaux + anciens)
    const events = await Event.find({ 
      organizerId: id,
      status: "approved"
    })
    .sort({ createdAt: -1 }) // Du plus récent au plus ancien
    .select('eventName description startDate endDate location thumbnail category');

    // 4. Construction de la réponse
    const response = {
      success: true,
      data: {
        organizerInfo: {
          organizationName: organizer.organizationName,
          logo: organizer.logo,
          description: organizer.description,
          location: organizer.location,
          createdAt: organizer.createdAt
        },
        events: events.map(event => ({
          name: event.eventName,
          description: event.description,
          dates: `${event.startDate.toLocaleDateString()} - ${event.endDate.toLocaleDateString()}`,
          location: event.location,
          image: event.thumbnail,
          category: event.category
        }))
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};



   