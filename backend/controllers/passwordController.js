const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Organizer = require('../models/EventOrganizer');
const sendEmail = require("../utils/sendEmail");
const {findUserByEmail} = require("../utils/userUtils");

//sending OTP
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Invalid email" });

        const user = await findUserByEmail(email);
        if (!user) {
          return res.status(200).json({ message: "Email not found" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setHours(otpExpiry.getHours() + 24);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Create JWT with the email
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        
        // Store JWT in cookie
        res.cookie('resetToken', token, { 
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        // Send OTP via email
        await sendEmail(email, 
            "Password Reset OTP", 
        `Your OTP for verification is: <strong>${otp}</strong>. This code will expire in 24 hours.`);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};

//verifying OTP 
const verifyOtp = async (req, res) => {
    try {
        const {otp} = req.body;
        const token = req.cookies.resetToken;

        if (!token) {
            return res.status(400).json({ 
                message: "Password reset token missing or expired, restart the reset process." 
            });
        }
        
        if (!otp) {
            return res.status(400).json({ 
                message: "OTP is required" 
            });
        }  
        // Verify and decode the JWT to get the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { email } = decoded;

        // Find the organizer/admin by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        
        // Verify the OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP has expired ( if current date is > otp expiry => false)
        if (user.otpExpiry && new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        
        //clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        
        res.json({ message: "Verified OTP successfully" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error resetting password", 
            error: error.message 
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const {newPassword, confirmNewPassword} = req.body;
        const token = req.cookies.resetToken;
        
        if (!token) {
            return res.status(400).json({ 
                message: "Password reset token missing or expired, restart the reset process." 
            });
        }

        if (!newPassword || !confirmNewPassword) {
            return res.status(400).json({ 
                message: "fields are required" 
            });
        }

        // Verify and decode the JWT to get the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { email } = decoded;
        
        // Find the organizer/admin by email
        const user = await findUserByEmail(email);
        if (!user) {
          return res.status(200).json({ message: "Email not found" });
        }

        // if (newPassword.length < 8) {
        //     return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        // }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password and clear OTP
        user.password = hashedPassword;
        await user.save();

         // Clear the reset token cookie
        res.clearCookie('resetToken');
        
        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error resetting password", 
            error: error.message 
        });
    }
};


// RESEND 
const resendOtp = async (req, res) => {
  try {
    const token = req.cookies.resetToken;

        if (!token) {
            return res.status(400).json({ 
                message: "Password reset token missing or expired, restart the reset process." 
            });
        }
    // Verify and decode the JWT to get the email
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email } = decoded;

    // Find the organizer/admin by email
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 24);
    
    // Update organizer with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send new OTP email
    await sendEmail(
      email,
      "New Password Reset OTP",
      `Your new verification code is: <strong>${otp}</strong>. This code will expire in 24 hours.`);

     // Create a new JWT with the email
    const newToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    
    // Update the cookie with the new token
    res.cookie('resetToken', newToken, { 
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
    
    return res.status(200).json({ 
      message: 'New OTP sent successfully' 
    });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred', message: error.message });
  }
};

// change password for profile
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const UserModel = userRole === 'organizer' ? Organizer : Admin;

        const user = await UserModel.findById(userId);

        // if (newPassword.length < 8) {
        //     return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        // }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }


        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

module.exports = {sendOtp, verifyOtp, resetPassword, resendOtp, changePassword};
