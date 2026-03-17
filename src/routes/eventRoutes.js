const express = require("express");
const prisma = require("../prisma/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/* =========================
   SLUG GENERATOR
========================= */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

/* =========================
   CREATE EVENT
========================= */
router.post("/create/event",  async (req, res) => {
  try {

    const {
      title,
      description,
      venueName,
      venueAddress,
      eventDateTime,
      speakerName,
      speakerRole,
      speakerBio,
      speakerImage,
      poweredByTitle,
      poweredByDesc,
      eventImage
    } = req.body;

    // 🔥 Generate slug
    let slug = generateSlug(title);

    // ensure unique slug
    let existing = await prisma.event.findUnique({ where: { slug } });
    let count = 1;

    while (existing) {
      slug = `${generateSlug(title)}-${count}`;
      existing = await prisma.event.findUnique({ where: { slug } });
      count++;
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        venueName,
        venueAddress,
        eventDateTime,
        speakerName,
        speakerRole,
        speakerBio,
        speakerImage,
        poweredByTitle,
        poweredByDesc,
        eventImage
      }
    });

    res.json({
      success: true,
      message: "Event created successfully",
      event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   GET ALL EVENTS
========================= */
router.get("/all/events", async (req, res) => {
  try {

    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      events
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   GET EVENT BY ID
========================= */
router.get("/event/:eventId", async (req, res) => {
  try {

    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { eventId }
    });

    if (!event) {
      return res.json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   GET EVENT BY SLUG (IMPORTANT)
========================= */
router.get("/event/:slug", async (req, res) => {
  try {

    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug }
    });

    if (!event) {
      return res.json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   UPDATE EVENT
========================= */
router.put("/event/:eventId", authMiddleware, async (req, res) => {
  try {

    const { eventId } = req.params;

    const updatedEvent = await prisma.event.update({
      where: { eventId },
      data: {
        ...req.body
      }
    });

    res.json({
      success: true,
      message: "Event updated",
      updatedEvent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/* =========================
   DELETE EVENT
========================= */
router.delete("/event/:eventId", authMiddleware, async (req, res) => {
  try {

    const { eventId } = req.params;

    await prisma.event.delete({
      where: { eventId }
    });

    res.json({
      success: true,
      message: "Event deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;