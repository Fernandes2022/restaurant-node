const { getUserIdFromToken } = require('../config/jwtProvider');
const User = require('../model/user.model')
const Address = require('../model/address.model');
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
 try {
  let {fullName, email, password, role} = userData;
  const isUserExist = await User.findOne({email:email})

  if(isUserExist){
   throw new Error('User already exists');                
  }

  password = await bcrypt.hash(password, 8);
  const user = User.create({
   fullName,
   email: email,
   password: password,
   role
  });

  return user;

 } catch (error) {
   throw new Error(error.message)
 }
}

const getUserByEmail = async(email) => {

   try {
     const user = await User.findOne({email: email});
     if(!user){
      throw new Error('User not found')
     }
     return user
   } catch (error) {
     throw new Error(error.message);
   }
}

const findUserById = async (userId) => {

   try {
    const user = await User.findById(userId).populate('addresses');

    if(!user){
     throw new Error('user not found');
    }
    return user;
   } catch (error) {
     throw new Error(error.message);
   }
}

const findUserProfileByJwt = async (jwt) => {

   try {
    const userId = getUserIdFromToken(jwt);
    const user = await findUserById(userId);

    return user;
   } catch (error) {
     throw new Error(error.message)
   }
}

const findAllUsers = async() => {
 try {
  const users = await User.find();
  return users;
 } catch (error) {
   throw new Error(error.message)
 }
}

module.exports = {
 createUser,
 getUserByEmail,
 findUserById,
 findUserProfileByJwt,
 findAllUsers
}