const express = require('express');
const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');
const attendanceRoutes = require('./routes/attendance');
const dashboardRoutes = require('./routes/dashboard');

const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
const Payroll = require('./models/Payroll');

const { verifyToken, requireAdmin } = require('./middleware/authCheck');
const roleCheck = require('./middleware/roleCheck');

const app = express();
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://mrudhulapreddy3016_db_user:mru123%21%21@dayflowcluster.bthnlss.mongodb.net/hrms?retryWrites=true&w=majority&appName=DayflowCluster"
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api/auth', authRoutes);


app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get("/employee-dashboard", verifyToken, roleCheck("Employee"), (req, res) => {
  res.json({ msg: "Welcome Employee Dashboard" });
});

app.get("/admin-dashboard", verifyToken, requireAdmin, (req, res) => {
  res.json({ msg: "Welcome Admin Dashboard" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
