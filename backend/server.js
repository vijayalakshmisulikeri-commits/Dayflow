const express = require('express');
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://mrudhulapreddy3016_db_user:mru123%21%21@dayflowcluster.bthnlss.mongodb.net/hrms?retryWrites=true&w=majority&appName=DayflowCluster"
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));


app.use('/auth', authRoutes);

app.get("/employee-dashboard", authMiddleware, roleMiddleware("Employee"), (req, res) => {
  res.json({ msg: "Welcome Employee Dashboard" });
});

app.get("/admin-dashboard", authMiddleware, roleMiddleware("Admin"), (req, res) => {
  res.json({ msg: "Welcome Admin Dashboard" });
});

app.listen(3000, () => console.log("Server running on port 3000"));