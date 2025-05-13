const mongoose = require('mongoose');
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const {uploadToCloudinary, extractPublicId} = require("../utils/uploadHelper");
const {deleteFromCloudinary} = require("../utils/uploadHelper");

const submitEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const {
      eventName,
      description,
      category,
      techField,
      deadline,
      startDate,
      endDate,
      prizes,
      cost,
      amount,
      locationType,
      city,
      eventLink,
      sponsorNames,
      additionalInfo,
    } = req.body;
    const { logo, verificationDoc, sponsorLogos } = req.files;


    if (!eventName ||
      !description || 
      !category || 
      !deadline || 
      !startDate || 
      !endDate || 
      !cost || 
      !locationType || 
      !eventLink||
      !verificationDoc ) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }
    
    // Date validations
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be before end date." });
    }
    if (new Date(deadline) > new Date(startDate)) {
      return res.status(400).json({ error: "Deadline must be before the event start date." });
    }

    // Location validation
    if (locationType === "Onsite" && !city) {
      return res.status(400).json({ error: "City is required for onsite events." });
    }

    //validating cost and amount
    if (cost === "paying" && amount < 0) {
     return res.status(400).json({ error: "Amount must be a positive number for paid events." });
    }

    // not sure if this is correct
    const existingEvent = await Event.findOne({ eventName, organizerId: organizerId, startDate });
    if (existingEvent ) {
    return res.status(400).json({ error: "You have already submitted this event." });
    }

    // Uploading the files
    const isImage = verificationDoc[0].mimetype.startsWith('image/');
    let verificationDocUrl = await uploadToCloudinary(
        verificationDoc[0],
        "TechEvents/EventDocs",
        isImage ? "image" : "raw");    

    const logoUrl = logo ? await uploadToCloudinary(logo[0], "TechEvents/Eventlogos", "image") : null;

    // an array to store sponsors if they exist
    let sponsoredByArray = [];

    // Check if there are any sponsor names was provided
    if (sponsorNames) {
    // Making sure sponsorNames is an array
    const namesArray = Array.isArray(sponsorNames) ? sponsorNames : [sponsorNames];
  
    // Now we go through each sponsor 
    for (let i = 0; i < namesArray.length; i++) 
    {
    // Checking if theres a logo with the sponsor name
    let sponsorLogoUrl = null;
    if (sponsorLogos && sponsorLogos[i]) { // they can give us a name without a logo
      sponsorLogoUrl = await uploadToCloudinary(
        sponsorLogos[i], 
        "TechEvents/SponsorLogos", 
        "image"
      );
    }
    
    // Adding the sponsor to the array we created
    sponsoredByArray.push({
      sponsorName: namesArray[i],
      sponsorLogo: sponsorLogoUrl
    });
  }
}
    let formattedPrizes = [];
    if (prizes) {
    formattedPrizes = Array.isArray(prizes) ? prizes : [prizes];
    }
    
    const newEvent = new Event({
      eventName,
      organizerId: organizerId,// best practice to save their id instead of name
      description,
      logo: logoUrl,
      category,
      techField,
      deadline,
      startDate,
      endDate,
      prizes,
      cost,
      locationType,
      city,
      sponsoredBy: sponsoredByArray,
      eventLink,
      additionalInfo,
      verificationDoc: verificationDocUrl,
    });

    await newEvent.save();
    res.status(201).json({
      message: "Event submitted successfully. Waiting admin approval!",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({ error: "Error submitting event.", message: error.message });
  }
};


// edit submitted event 
const editSubmittedEvent = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { eventId } = req.params;
    
    const {
      eventName,
      description,
      category,
      techField,
      deadline,
      startDate,
      endDate,
      prizes,
      cost,
      amount,
      locationType,
      city,
      eventLink,
      sponsorNames,
      additionalInfo,
    } = req.body;
    
    const { logo, verificationDoc, sponsorLogos } = req.files || {};
    
    // Find the existing event
    const existingEvent = await Event.findOne({ 
      _id: eventId, 
      organizerId: organizerId 
    });
    
    if (!existingEvent) {
      return res.status(404).json({ 
        error: "Event not found."
      })
    }
    
    //only pending events can be edited
    if (existingEvent.status !== 'pending') {
      return res.status(403).json({
        error: "event can't be edited."
      });
    }
    
    // required fields
    if (!eventName ||
        !description || 
        !category || 
        !deadline || 
        !startDate || 
        !endDate || 
        !cost || 
        !locationType || 
        !eventLink ||
        !verificationDoc) {
      return res.status(400).json({ 
        error: "Please fill in all required fields." 
      });
    }
    
    //the update object
    const eventUpdate = {
      eventName,
      description,
      category,
      techField,
      deadline,
      startDate,
      endDate,
      cost,
      amount,
      locationType,
      city,
      eventLink,
      additionalInfo
    };
    
    // Handle prizes
    if (prizes) {
      eventUpdate.prizes = Array.isArray(prizes) ? prizes : [prizes];
    } else {
      eventUpdate.prizes = [];
    }
    
    // Handle logo updates
    if (logo) {
      if (existingEvent.logo) {
        try {
          const publicId = extractPublicId(existingEvent.logo);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error("Error deleting existing logo:", error);
        }
      }
      // Upload the new logo
      eventUpdate.logo = await uploadToCloudinary(logo[0], "TechEvents/Eventlogos", "image");
    }
    
    // Handle verification document updates
    if (verificationDoc && verificationDoc.length > 0) {
      // If a new verification doc is uploaded, delete the old one first
      if (existingEvent.verificationDoc) {
        try {
          const publicId = extractPublicId(existingEvent.verificationDoc);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error("Error deleting existing verification document:", error);
        }
      }
      // Upload the new verification doc
      const isImage = verificationDoc[0].mimetype.startsWith('image/');
      eventUpdate.verificationDoc = await uploadToCloudinary(
        verificationDoc[0],
        "TechEvents/EventDocs",
        isImage ? "image" : "raw"
      );
    }
    
    // Handle sponsor updates
    if (sponsorNames) {
      // Delete all existing sponsor logos from Cloudinary
      const existingSponsors = existingEvent.sponsoredBy || [];
      for (const sponsor of existingSponsors) {
        if (sponsor.sponsorLogo) {
          try {
            const publicId = extractPublicId(sponsor.sponsorLogo);
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (error) {
            console.error("Error deleting sponsor logo:", error);
          }
        }
      }
      
      // Create fresh array for new sponsors
      const updatedSponsors = [];
      
      // Make sure sponsorNames is an array
      const namesArray = Array.isArray(sponsorNames) ? sponsorNames : [sponsorNames];
      
      // Process each sponsor name
      for (let i = 0; i < namesArray.length; i++) {
        //if the name is empty we skip it even the logo
        if (!namesArray[i].trim()) continue;
        
        let sponsorLogoUrl = null;
        
        // If there's a logo for this sponsor, upload it
        if (sponsorLogos && sponsorLogos[i]) {
          sponsorLogoUrl = await uploadToCloudinary(
            sponsorLogos[i],
            "TechEvents/SponsorLogos",
            "image"
          );
        }
        
        // Add this sponsor to our list
        updatedSponsors.push({
          sponsorName: namesArray[i],
          sponsorLogo: sponsorLogoUrl
        });
      }
      
      // Replace all sponsors with the new list
      eventUpdate.sponsoredBy = updatedSponsors;
    }
    
    // Update the event in the database
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: eventUpdate },
      { new: true }
    );
    
    res.status(200).json({
      message: "Event updated successfully. Waiting for admin approval!",
      event: updatedEvent,
    });
    
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ 
      error: "Error updating event.", 
      message: error.message 
    });
  }
};

const cancelSubmittedEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        // Vérification renforcée de l'authentification
        if (!req.user) {
            console.error("Erreur: Aucun utilisateur dans la requête");
            return res.status(401).json({
                success: false,
                message: "Authentification requise"
            });
        }

        // Gestion des différents formats d'ID
        const organizerId = req.user._id || req.user.id;
        if (!organizerId) {
            console.error("Erreur: ID organisateur manquant dans le token");
            return res.status(401).json({
                success: false,
                message: "Token invalide: ID utilisateur manquant"
            });
        }

        console.log("Tentative de suppression:", { 
            eventId, 
            organizerId: organizerId.toString() 
        });

        // Validation des ObjectId
        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(organizerId)) {
            return res.status(400).json({
                success: false,
                message: "Format d'ID invalide"
            });
        }

        const eventObjectId = new mongoose.Types.ObjectId(eventId);
        const organizerObjectId = new mongoose.Types.ObjectId(organizerId);

        // Recherche de l'événement avec vérification du propriétaire
        const event = await Event.findOne({
            _id: eventObjectId,
            organizerId: organizerObjectId
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Événement non trouvé ou non autorisé"
            });
        }

        // Vérification du statut
        if (event.status !== "pending") {
            return res.status(403).json({
                success: false,
                message: "Suppression autorisée seulement pour les événements 'pending'"
            });
        }

        // Nettoyage from  Cloudinary 
if (deletedEvent.media?.length > 0) {
  try {
      const mediaDeletions = deletedEvent.media.map(mediaItem => {
          if (mediaItem.public_id) {
              return deleteFromCloudinary(mediaItem.public_id)
                 .catch(e => console.error(`Échec suppression ${mediaItem.type}:`, e));
          }
          return Promise.resolve();
      });

      await Promise.all(mediaDeletions);
      
      console.log(`Suppression réussie - ${deletedEvent.media.length} médias sur Cloudinary`, {
          types: deletedEvent.media.map(m => m.type), // 'image' ou 'pdf'
          ids: deletedEvent.media.map(m => m.public_id)
      });

  } catch (cloudinaryError) {
      console.error("Erreur partielle Cloudinary:", cloudinaryError);
  }
}
        // Réponse de succès
        return res.status(200).json({
            success: true,
            message: "Événement supprimé avec succès",
            deletedEventId: deletedEvent._id
        });

    } catch (error) {
        console.error("Erreur complète:", error);
        
        // Gestion spécifique des erreurs MongoDB
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                success: false,
                message: "Format d'ID invalide"
            });
        }

        // Réponse d'erreur générique
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression"
        });
    }
    // Suppression avec vérification
    const deletedEvent = await Event.findOneAndDelete({
        _id: eventObjectId,
        organizerId: organizerObjectId,
        status: "pending"
    });

    if (!deletedEvent) {
        throw new Error("La suppression a échoué sans erreur détectée");
    }
};



module.exports = {submitEvent, editSubmittedEvent, cancelSubmittedEvent};



// if you want to make for only onsite verDoc required 
//in DB in verDoc remove required: true
// in the code do this :

// if (locationType === "Onsite" && !verificationDoc){
    //   return res.status(400).json({ error: "verification document is required!" });
    // }
      
// let verificationDocUrl = null;
    // if (verificationDoc) {
    //   const isImage = verificationDoc[0].mimetype.startsWith('image/');
    //   verificationDocUrl = await uploadToCloudinary(
    //     verificationDoc[0],
    //     "TechEvents/EventDocs",
    //     isImage ? "image" : "raw"
    //   );
    // }
