const { getUserIdFromToken } = require("../config/jwtProvider");
const { findUserById } = require("../services/userServices");
const Address = require("../model/address.model");


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

module.exports = {
  authenticate
};