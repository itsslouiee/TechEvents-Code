const mongoose = require('mongoose');
const Organizer = require('../models/EventOrganizer');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");
const { extractPublicId } = require("../utils/uploadHelper");
const {
  approvalEmailTemplate,
  rejectionEmailTemplate,
  deletionEmailTemplate,
  eventApprovalEmailTemplate,
  eventRejectionEmailTemplate,
  eventDeletionEmailTemplate,
} = require("../utils/emailTemplate");

//14 FCTS HERE

//fetch "pending" registrations
const getPendingRegistrations = async (req, res) => {
  try {
    const pendingOrganizers = await Organizer.find(
      { status: "pending" },
      "organizationName email location createdAt verificationDoc _id"
    ).sort({ createdAt: -1 });
    res.status(200).json({
      message: "Registrations fetched successfully",
      count: pendingOrganizers.length,
      organizers: pendingOrganizers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending registrations",
      error: error.message,
    });
  }
};

//fetch "approved" organizers
const getApprovedOrganizers = async (req, res) => {
  try {
    const approvedOrganizers = await Organizer.find(
      { status: "approved" },
      "logo organizationName email location updatedAt _id"
    );

    res.status(200).json({
      message: "Organizers fetched successfully",
      count: approvedOrganizers.length,
      organizers: approvedOrganizers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch approved organizers",
      error: error.message,
    });
  }
};

//delete an organizer
const deleteOrganizer = async (req, res) => {
  const { organizerId } = req.params;
  try {
    const organizer = await Organizer.findById(organizerId);
    const emailTemplate = deletionEmailTemplate(organizer.organizationName);
    const email = organizer.email;

    if (organizer.status == "pending") {
      return res.status(403).json({
        error: "organizer isn't approved.",
      });
    }

    try {
      const events = await Event.find({ organizerId: organizerId });

      // Delete each event's images from Cloudinary if they exist
      for (const event of events) {
        if (event.images && event.images.length > 0) {
          for (const imageUrl of event.images) {
            try {
              const publicId = extractPublicId(imageUrl);
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
              }
            } catch (error) {
              console.error(`Error deleting event image: ${imageUrl}`, error);
            }
          }
        }
        // Delete event from database
        await Event.findByIdAndDelete(event._id);
      }
    } catch (error) {
      console.error("Error deleting organizer's events:", error);
    }

    // deleting logo from cloudinary
    if (organizer.logo) {
      try {
        const publicId = extractPublicId(organizer.logo);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("Error deleting existing logo:", error);
      }
    }

    //deleting verification Doc from cloudinary
    if (organizer.verificationDoc) {
      try {
        const publicId = extractPublicId(organizer.verificationDoc);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error("Error deleting existing verification document:", error);
      }
    }

    // Delete the organizer
    await Organizer.findByIdAndDelete(organizerId);

    const emailResponse = await sendEmail(
      email,
      "Account Removed from Platform",
      emailTemplate
    );

    if (emailResponse.success) {
      res.status(200).json({
        message: "Organizer deleted successfully and notification email sent.",
      });
    } else {
      res.status(200).json({
        message:
          "Organizer deleted successfully, but notification email failed.",
        error: emailResponse.error,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete organizer", error: error.message });
  }
};

// Approve Registration
const approveRegistration = async (req, res) => {
  const { organizerId } = req.params;

  try {
    const organizer = await Organizer.findOne({
      _id: organizerId,
      status: "pending",
    });

    if (!organizer) {
      return res.status(404).json({ message: "Event organizer not found" });
    }
    organizer.status = "approved";
    await organizer.save();

    // Login link (replace with actual frontend login URL)
    const loginLink = `${process.env.FRONTEND_URL}/organizer/login`;

    const emailTemplate = approvalEmailTemplate(
      organizer.organizationName,
      loginLink
    );

    const emailResponse = await sendEmail(
      organizer.email,
      "Registration Approved 🎉",
      emailTemplate
    );

    if (emailResponse.success) {
      res
        .status(200)
        .json({ message: "Event organizer approved and email sent." });
    } else {
      res.status(500).json({
        message: "Event organizer approved, but email failed.",
        error: emailResponse.error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error: error.message });
  }
};

// Reject Registration
const rejectRegistration = async (req, res) => {
  const { organizerId } = req.params;

  try {
    const organizer = await Organizer.findOne({
      _id: organizerId,
      status: "pending",
    });
    if (!organizer) {
      return res.status(404).json({ message: "Event organizer not found" });
    }

    if (organizer.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Event organizer is not in pending state" });
    }
    const emailTemplate = rejectionEmailTemplate(organizer.organizationName);
    const email = organizer.email;
    await Organizer.deleteOne({ _id: organizerId });

    const emailResponse = await sendEmail(
      email,
      "Registration Update",
      emailTemplate
    );

    if (emailResponse.success) {
      res
        .status(200)
        .json({ message: "Event organizer rejected, deleted and email sent." });
    } else {
      res.status(500).json({
        message: "Event organizer rejected, but email failed.",
        error: emailResponse.error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Rejection failed", error: error.message });
  }
};

//fetch all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "name email profilePic _id");

    res.status(200).json({
      message: "Admins fetched successfully",
      count: admins.length,
      admins: admins,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch admins",
      error: error.message,
    });
  }
};

const getPendingEvents = async (req, res) => {
    try {
        const pendingEvents = await Event.find({ status: 'pending' })
            .populate('organizerId', 'organizationName ')
            .select('eventName category logo organizerId startDate locationType city _id');

    res.json({
      success: true,
      count: pendingEvents.length,
      data: pendingEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getApprovedEvents = async (req, res) => {
    try {
        
        const approvedEvents = await Event.find({ status: 'approved' })
            .populate('organizerId', 'organizationName')
            .select('eventName category logo organizerId startDate locationType city _id');

    res.json({
      success: true,
      count: approvedEvents.length,
      data: approvedEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch approved events",
    });
  }
};

// Approuver un événement
const approveEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid event ID format",
    });
  }

  try {
    const event = await Event.findById(eventId)
      .populate({
        path: "organizerId",
        select: "email organizationName",
        model: "Organizer",
      })
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    if (!event.organizerId) {
      return res.status(400).json({
        success: false,
        error: "Organizer not found for this event",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $set: { status: "approved" } },
      { new: true }
    );

    let updatedOrganizer;
    try {
      updatedOrganizer = await Organizer.findByIdAndUpdate(
        event.organizerId._id,
        { $inc: { eventCount: 1 } },
        { new: true }
      );
    } catch (organizerError) {
      console.error("Error updating organizer:", organizerError);
    }
    try {
      await sendEmail(
        event.organizerId.email,
        `Event Approved: ${event.eventName}`,
        eventApprovalEmailTemplate(event)
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    return res.json({
      success: true,
      message: "Event approved successfully",
      event: {
        id: updatedEvent._id,
        name: updatedEvent.eventName,
        status: updatedEvent.status,
      },
      organizerUpdated: !!updatedOrganizer,
    });
  } catch (error) {
    console.error("APPROVAL ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
            }
          : undefined,
    });
  }
};

// Reject Event
const rejectEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid event ID format",
    });
  }

  try {
    const event = await Event.findById(eventId)
      .populate({
        path: "organizerId",
        select: "email organizationName",
        model: "Organizer",
      })
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    if (event.organizerId?.email) {
      try {
        await sendEmail(
          event.organizerId.email,
          `Event Rejected: ${event.eventName}`,
          eventRejectionEmailTemplate(event)
        );
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
      }
    }

    const result = await Event.deleteOne({ _id: eventId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Event not found to delete",
      });
    }

    return res.json({
      success: true,
      message: "Event rejected, email sent, and event deleted",
    });
  } catch (error) {
    console.error("REJECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: error.message,
              stack: error.stack,
            }
          : undefined,
    });
  }
};

const deleteEventAdmin = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId).populate(
      "organizerId",
      "email organizationName"
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.status === "pending") {
      return res.status(403).json({
        error: "Pending events require approval/rejection first",
      });
    }

    if (event.logo) {
      const publicId = extractPublicId(event.logo);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    const emailTemplate = eventDeletionEmailTemplate(
      event.eventName,
      event.organizerId.organizationName
    );
    const email = event.organizerId.email;
    const eventname = event.eventName;

    await Event.findByIdAndDelete(eventId);

    await sendEmail(email, `Event Removed: ${eventname}`, emailTemplate);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(query, "i");
    const events = await Event.find({
      $or: [
        { eventName: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { techField: searchRegex },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search events",
    });
  }
};

module.exports = {
  approveRegistration,
  rejectRegistration,
  getPendingRegistrations,
  getApprovedOrganizers,
  deleteOrganizer,
  getAdmins,
  getPendingEvents,
  getApprovedEvents,
  approveEvent,
  rejectEvent,
  deleteEventAdmin,
  searchEvents,
};
