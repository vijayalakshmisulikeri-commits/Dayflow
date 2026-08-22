const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/auth');


const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/hrms');

app.use('/auth', authRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
