const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();



/* =========================
   REGISTER
========================= */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    res.json({
      success: true,
      message: "User registered",
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});



/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});



/* =========================
   PROFILE (PROTECTED)
========================= */

router.get("/profile", authMiddleware, async (req, res) => {

  const user = await prisma.user.findUnique({
    where: { id: req.userId }
  });

  res.json({
    success: true,
    user
  });

});



/* =========================
   LOGOUT
========================= */

router.post("/logout", (req, res) => {

  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out"
  });

});


module.exports = router;