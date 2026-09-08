const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authCheck");

router.get("/test", (req, res) => {
  res.json({ msg: "Auth route is working!" });
});

// Signup — auto-verified, no email step (testing mode)
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role, name, phone, address } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required", message: "Email and password are required" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered", message: "Email already registered" });
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
      verified: true,
    });

    await user.save();

    res.status(201).json({ msg: "Signup successful. You can log in now." });
  } catch (err) {
    console.error("SIGNUP ERROR:", err); // now prints the real reason to the backend terminal
    res.status(500).json({ msg: "Server error", message: err.message, error: err.message });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials", message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials", message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, id: user._id });
  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    res.status(500).json({ msg: "Server error", message: err.message, error: err.message });
  }
});

// Profile CRUD
router.get("/profile/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    res.status(500).json({ msg: "Server error", message: err.message });
  }
});

router.put("/profile/me", verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    console.error("PROFILE PUT ERROR:", err);
    res.status(500).json({ msg: "Server error", message: err.message });
  }
});

module.exports = router;