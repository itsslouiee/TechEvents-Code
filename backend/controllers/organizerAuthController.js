const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const sendEmail = require("../utils/sendEmail");
const Organizer = require('../models/EventOrganizer');

//SignUp of Organizer
const signup = async (req, res) => {
  try {
    const { organizationName, email, password, confirmPassword, location } = req.body;
    const verificationDoc = req.file;
    const isImage = verificationDoc.mimetype.startsWith('image/'); 
    
    // Basic validation
    if (!organizationName || !email || !password || !confirmPassword || !location || !verificationDoc) {
      return res.status(400).json({ error: 'Please fill in the required fields' });
    }

    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({ 
    //     error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
    //   });
    // }

    const existingOrganizer = await Organizer.findOne({ email });

    // Check for existing email
    if (existingOrganizer) {
      return res.status(400).json({ error: 'Email already used' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const publicId = `${verificationDoc.originalname.split('.')[0]}_${Date.now()}`;
    cloudinary.uploader.upload_stream(
      { 
        resource_type:  isImage ? 'image' : 'raw', 
        folder: 'TechEvents/RegistrationDocs', 
        use_filename: true,
        unique_filename: false, 
        overwrite: false,
        public_id: publicId 
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to upload document, try again.', message: error.message });
        }

        try {
          // Create and save organizer
          const newOrganizer = new Organizer({
            organizationName,
            email,
            password: hashedPassword,
            location,
            verificationDoc: result.secure_url // The uploaded document's URL
            // isVerified: false
          });

          await newOrganizer.save(); // Save the new organizer to DB
          
          // const verificationToken = jwt.sign(
          //   { id: newOrganizer.id },
          //   process.env.JWT_SECRET_KEY,
          //   { expiresIn: '24h' }
          // );
          // const verificationUrl = `${process.env.FRONTEND_URL}/organizer/verify-email?token=${verificationToken}`;
          // console.log('VERIFICATION URL:', verificationUrl);

          // const emailResult = await sendEmail(
          //   email,
          //   "Verify Your Email",
          //   `<h1>Welcome to TechEvents!</h1>
          //   <p>Please verify your email by clicking this link:</p>
          //   <p><a href="${verificationUrl}">Verify My Email</a></p>
          //   <p>This link will expire in 24 hours.</p>`);

          // if (!emailResult.success) {
          //   console.error('Email failed but account created:', emailResult.error);
          // }

          // Success response
          res.status(201).json({
            message: 'Signup successful!',
            organizer: {
              organizationName: newOrganizer.organizationName,
              email: newOrganizer.email,
              location: newOrganizer.location,
              verificationDoc: newOrganizer.verificationDoc,
            }
          });
        } catch (err) {
          // Catch errors related to saving the organizer
          res.status(500).json({ error: 'Error saving organizer to database', message:err.message });
        }
      }
    ).end(verificationDoc.buffer); // End the stream and pass the file buffer

  } catch (error) {
    // Catch any other unexpected errors
    res.status(500).json({ error: 'An error occurred during signup, try again.', message: error.message });
  }
};

// verify email 
const verifyEmail = async (req, res) => {
  try {
     const {token} = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_TOKEN',
        error: 'Verification token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
     const organizer = await Organizer.findById(decoded.id);

    if (!organizer) {
      return res.status(404).json({ 
        success: false,
        error: 'NOT_FOUND',
        message: 'Email not found'
      });
    }

    // Check verification status
    if (organizer.isVerified) {
      return res.status(400).json({ 
        error: 'ALREADY_VERIFIED',
        message: 'Email is verified'
      });
    }

    // Update organizer
    organizer.isVerified = true;   
    await organizer.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: organizer.email,
        organizationName: organizer.organizationName
      }
    });

  } catch (error) {

    console.error("Verification failed:", error.message);
    res.status(400).json({ 
      error: "Verification failed",
      reason: error.name === 'TokenExpiredError' ? "Expired token" : "Invalid token"
    });
  }
};


//Login of Organizer & its diff from login admin since we need to check status
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if organizer exists
    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(400).json({ error: 'Organizer not found' });
    }

    // if (!organizer.isVerified) {
    //   return res.status(401).json({ 
    //     error: 'Email not verified', 
    //     message: 'Please verify your email before logging in' 
    //   });
    // }
    
    // Check if organizer is approved
    if (organizer.status !== "approved") {
      return res.status(403).json({ 
        error: "Account Not Approved",
        errorCode: "ACCOUNT_PENDING_APPROVAL" // Consistent error codes
      });
    }
    
    // Compare passwords
    const isCorrect = await bcrypt.compare(password, organizer.password);
    if (!isCorrect) {
      return res.status(400).json({ 
        error: 'Invalid email or password',
        errorCode: "INVALID_CREDENTIALS"
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: organizer._id, role: organizer.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Set cookie (optional since we're also returning token)
    res.cookie("accessToken", token, { 
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000
    });
    
    // Successful response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // For localStorage approach
      user: {
        id: organizer._id,
        name: organizer.organizationName,
        email: organizer.email
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: 'An error occurred, please try again',
      errorCode: "SERVER_ERROR"
    });
  }
};


//Logout of Organizer
const logout = (req, res) => {
  try {
    res.cookie("accessToken", "", { 
      httpOnly: true, 
      sameSite: "lax",  
      secure: process.env.NODE_ENV === 'production',  
      path: '/',
      maxAge: 0 // Cookie expires immediately
    });

    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ error: "An error occurred while logging out.", message: err.message });
  }
};

module.exports = {signup, login, logout, verifyEmail};
