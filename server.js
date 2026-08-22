const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// --- Your routes (Member 3: Payroll & Dashboard) ---
const payrollRoutes = require("./routes/payroll");
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/payroll", payrollRoutes);
app.use("/api/dashboard", dashboardRoutes);

// NOTE: teammates will add their own routes here, e.g.
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/attendance", require("./routes/attendance"));
// app.use("/api/leave", require("./routes/leave"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dayflow";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
