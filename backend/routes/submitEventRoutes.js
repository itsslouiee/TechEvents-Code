const express = require("express");
const router = express.Router();
const {verifyToken, verifyOrganizer} = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {submitEvent, editSubmittedEvent, cancelSubmittedEvent} = require("../controllers/submitEventController");


// submit event
router.post("/submit", verifyToken, verifyOrganizer, upload.fields([{ name: "logo" }, { name: "verificationDoc" }, {name: "sponsorLogos"}]), submitEvent);

// edit submitted event
router.put("/edit/:eventId", verifyToken, verifyOrganizer, upload.fields([{ name: "logo" }, { name: "verificationDoc" }, { name: "sponsorLogos" }]), editSubmittedEvent);

// cancel submitted event 
router.delete("/:eventId", verifyToken, verifyOrganizer, cancelSubmittedEvent);

module.exports = router;