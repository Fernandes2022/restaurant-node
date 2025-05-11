const {createCategory, findCategoryByRestaurantId, findCategoryById} = require('../services/categoryService');
const {getUserById} = require('../services/userServices');

const createCategoryController = async (req, res) => {
  try {
   const category = req.body;
   const user = req.user;

   const createdCategory = await createCategory(category.name, user._id);
   res.status(201).json(createdCategory);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}


const findCategoryByRestaurantIdController = async (req, res) => {
  try {
       const {id} = req.params;
       const categories = await findCategoryByRestaurantId(id);
       res.status(200).json(categories);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}


module.exports = {
  createCategoryController,
  findCategoryByRestaurantIdController
}

