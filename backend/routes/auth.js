const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authCheck");

router.get("/test", (req, res) => {
  res.json({ msg: "Auth route is working!" });
});

// 🔑 Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role, name, phone, address } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      name,
      phone,
      address,
      verified: false,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    user.verificationToken = token;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Verify your email",
      text: `Click here to verify: http://localhost:3000/api/auth/verify/${token}`,
    });

    res.status(201).json({ msg: "Signup successful. Please check your email to verify." });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔑 Verify Email
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
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

    if (!user.verified) {
      return res.status(403).json({ msg: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // role MUST be in the payload — every protected route depends on req.user.role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, id: user._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔑 Profile CRUD
router.get("/profile/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/profile/me", verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select(
      "-password"
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
