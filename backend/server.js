const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser'); // Add for cookie handling
const connectDB = require('./config/db');//importing databse
const cronJobs = require('./utils/cronJobs');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const organizerRoutes = require('./routes/organizerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const submitEventRoutes = require("./routes/submitEventRoutes");
const mainRoutes = require("./routes/mainRoutes");
const publicRoutes = require("./routes/publicRoutes");

require("dotenv").config();

// Connecting to Database
connectDB();

// Initialize Cron Jobs
cronJobs(); 

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parsing
app.use(express.json()); // Parsing JSON data
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Required for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'] // Allowed headers
}));
	
//using routes 
app.use("/auth", authRoutes);
app.use("/organizer", organizerRoutes);
app.use("/admin", adminRoutes);
app.use("/event", submitEventRoutes);
app.use("/main", mainRoutes);
app.use("/public", publicRoutes)


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error' 
  });
});

// Testing the route
app.get("/", (req, res) => {
  res.send("TechEvents API is working!");
});


// Start Server
app.listen(PORT, ()=> {
	console.log(`server is running on port ${PORT}`);	
});