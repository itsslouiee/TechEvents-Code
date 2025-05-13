const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const { changePassword } = require("../controllers/passwordController");
const { login, logout } = require("../controllers/adminAuthController");
const {
  approveRegistration,
  rejectRegistration,
  getPendingRegistrations,
  getApprovedOrganizers,
  deleteOrganizer,
  getAdmins,
} = require("../controllers/adminController");
const {
  approveEvent,
  rejectEvent,
  getApprovedEvents,
  getPendingEvents,
  deleteEventAdmin,
  searchEvents,
} = require("../controllers/adminController");

// 14 functionalities related to admin

//admin auth routes
router.post("/login", login);
router.post("/logout", verifyToken, verifyAdmin, logout);

//approve/reject registration routes
router.put(
  "/approve-registration/:organizerId",
  verifyToken,
  verifyAdmin,
  approveRegistration
);
router.put(
  "/reject-registration/:organizerId",
  verifyToken,
  verifyAdmin,
  rejectRegistration
);

//fetch "pending" registrations
router.get(
  "/registrations/pending",
  verifyToken,
  verifyAdmin,
  getPendingRegistrations
);

//fetch "approved" organizers
router.get(
  "/organizers/approved",
  verifyToken,
  verifyAdmin,
  getApprovedOrganizers
);

//delete an organizer
router.delete("/organizer/:organizerId", deleteOrganizer);

//fetch all admins
router.get("/admins", verifyToken, verifyAdmin, getAdmins);

//change password
router.put("/changepassword", verifyToken, verifyAdmin, changePassword);

//fetch "pending" event submissions
router.get("/events/pending", verifyToken, verifyAdmin, getPendingEvents);

//fetch "approved" events
router.get("/events/approved", verifyToken, verifyAdmin, getApprovedEvents);

//search events
router.get("/events/search", verifyToken, verifyAdmin, searchEvents);

//approve/reject event submission
router.post("/approve-event/:eventId", verifyToken, verifyAdmin, approveEvent);
router.post("/reject-event/:eventId", verifyToken, verifyAdmin, rejectEvent);

// delete event by admin
router.delete(
  "/delete-event/:eventId",
  verifyToken,
  verifyAdmin,
  deleteEventAdmin
);

module.exports = router;
