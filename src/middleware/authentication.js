const { getUserIdFromToken } = require("../config/jwtProvider");
const { findUserById } = require("../services/userServices");
const Address = require("../model/address.model");
const { v4: uuidv4 } = require('uuid');


const authenticate = async (req, res, next) => {

 try {
  const token = req.headers.authorization?.split(" ")[1];
  
  if(!token){
   throw new Error('No token provided');
  }

  const userId = getUserIdFromToken(token);
  const user = await findUserById(userId);

  req.user = user;

  next();
 } catch (error) {
   throw new Error(error.message);
   
 }
 
}

// Optional customer identity: if JWT present, attach req.user; otherwise ensure req.guestId via cookie
const identifyCustomer = async (req, res, next) => {
 try {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
   try {
    const userId = getUserIdFromToken(token);
    const user = await findUserById(userId);
    if (user) {
     req.user = user;
     return next();
    }
   } catch (_) {
    // ignore invalid/expired token and continue as guest
   }
  }

  let guestId = req.cookies?.guestId;
  if (!guestId) {
   guestId = uuidv4();
   const isProd = process.env.NODE_ENV === 'production';
   res.cookie('guestId', guestId, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30
   });
  }
  req.guestId = guestId;
  return next();
 } catch (error) {
  return next();
 }
}

// Role-based authorization for authenticated users
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  }
}

module.exports = {
  authenticate,
  identifyCustomer,
  authorizeRoles
};