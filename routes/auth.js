const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// 🔑 Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role, name, phone, address } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      name,
      phone,
      address,
      verified: false
    });

    // Generate verification token
    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1d" });
    user.verificationToken = token;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "yourEmail@gmail.com", pass: "yourPassword" }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Verify your email",
      text: `Click here to verify: http://localhost:3000/auth/verify/${token}`
    });

    res.status(201).json({ msg: "Signup successful. Please check your email to verify." });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔑 Verify Email
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, "secretKey");
    const user = await User.findById(decoded.id);

    if (!user || user.verificationToken !== req.params.token) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
});

// 🔑 Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Block login if not verified
    if (!user.verified) {
      return res.status(403).json({ msg: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔑 Profile CRUD
router.get("/profile/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/profile/me", authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
