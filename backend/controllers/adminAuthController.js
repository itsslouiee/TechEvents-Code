const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ error: 'Admin not found' });
    }
    // Check if the password is correct
    const isCorrect = await bcrypt.compare(password, admin.password);
    if (!isCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    // Generating access token
    const token = jwt.sign(
      { id: admin.id, role: admin.role},
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' } 
    );

     // Setting the token in the cookies
    res.cookie("accessToken", token, { 
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });
     res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        profilePic: admin.profilePic
      },
    });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred. Please try again.', message: error.message });
  }
};


//Admin logout
const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", { 
      httpOnly: true, 
      sameSite: "lax",  
      secure: process.env.NODE_ENV === 'production',  
      path: '/' 
    });
    // No need for maxAge when using clearCookie()

    res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ error: "An error occurred while logging out.", message: err.message });
  }
};

module.exports = { login, logout };