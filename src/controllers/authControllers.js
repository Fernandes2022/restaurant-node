require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../model/user.model');

const {
 createUser,
 getUserByEmail,
 findUserById,
 findUserProfileByJwt,
 findAllUsers
} = require('../services/userServices');
const { generateToken } = require('../config/jwtProvider');

const register = async (req, res) => {
   try {
    const user = await createUser(req.body);
    const jwt = generateToken(user._id);
    
    return res.status(201).send({jwt, message: 'Registered successfully'})
   } catch (error) {
     return res.status(500).send({error:error.message})
   }
}

const login = async(req, res) => {
   const {password, email} = req.body;
   
   try {
    const user = await getUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(401).send({message:"invalid password"});
    }

    const jwt = generateToken(user._id);
    return res.status(200).send({jwt, message:"successfully logged in"})

   } catch (error) {
     return res.status(500).send({error:error.message})
   }
}


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).send({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false 
      }
    });

    const sanitizedBaseUrl = 'https://nutri-c1.vercel.app';
    const resetURL = `${sanitizedBaseUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;
    const message = `Reset your password by clicking ${resetURL}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset',
      text: message
    });

    return res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).send({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};




module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
}