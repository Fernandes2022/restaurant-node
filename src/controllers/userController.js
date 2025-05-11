
const getUserProfileHandler = async(req, res) => {
  try {
    user = req.user;
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    if(error instanceof Error){
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
} 



module.exports = {
  getUserProfileHandler
};
