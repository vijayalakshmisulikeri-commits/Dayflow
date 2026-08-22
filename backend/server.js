const express = require('express');
const authRoutes = require('../routes/auth');


const app = express();
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://mrudhulareddy3016_db_user:Y0v2FEFs2tUbgrH4@dayflowcluster.bthnlss.mongodb.net/hrms?retryWrites=true&w=majority&appName=DayflowCluster"
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));


app.use('/auth', authRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
