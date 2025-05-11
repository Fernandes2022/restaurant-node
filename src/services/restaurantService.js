const Restaurant = require('../model/restaurant.model');
const Address = require('../model/address.model');
const Order = require('../model/order.model');

const createRestaurant = async (req, user) => {
   try {
    const address = new Address({
     city: req.address.city,
     country: req.address.country,
     fullName: req.address.fullName,
     postalCode: req.address.postalCode,
     state: req.address.state,
     streetAddress: req.address.streetAddress,
    })

    const saveAddress = await address.save();

    const restaurant = new Restaurant({
      address: saveAddress,
      contactInformation: req.contactInformation,
      cuisineType: req.cuisineType,
      description: req.description,
      images: req.images,
      name: req.name,
      openingHours: req.openingHours,
      registrationDate: new Date(),
      owner: user,
      open: true,
      numRating: 0
    })

    const saveRestaurant = await restaurant.save();
    return saveRestaurant;
   } catch (error) {
      throw new Error(error.message);
   }
}

const findRestaurantById = async(restaurantId) => {
   try {
    const restaurant = await Restaurant.findById(restaurantId)
      .populate('address')
      .populate('owner')
      .populate('foods')
      .populate('orders');

    if(!restaurant) throw new Error('restaurant not found')

     return restaurant;
   } catch (error) {
     throw new Error(error.message);
   }
}

const getRestaurantByUserId = async(userId) => {
   try {
      const restaurant = await Restaurant.findOne({owner: userId})
        .populate('owner')
        .populate('address')
        .populate('foods')
        .populate('orders');

      if(!restaurant){
         throw new Error("restaurant not found");
      }

      return restaurant;
   } catch (error) {
      throw new Error(error.message);
   }
}

const updateRestaurant = async(restaurantId, updateData) => {
   try {
      const restaurant = await findRestaurantById(restaurantId);
      
      if (updateData.address) {
         const address = await Address.findByIdAndUpdate(
            restaurant.address._id,
            updateData.address,
            { new: true }
         );
         updateData.address = address._id;
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
         restaurantId,
         { $set: updateData },
         { new: true }
      ).populate('address')
       .populate('owner')
       .populate('foods')
       .populate('orders');

      return updatedRestaurant;
   } catch (error) {
      throw new Error(error.message);
   }
}

const deleteRestaurant = async(restaurantId) => {
   try {
      const restaurant = await findRestaurantById(restaurantId);
      
      await Address.findByIdAndDelete(restaurant.address._id);
      
      await Restaurant.findByIdAndDelete(restaurantId);

      return { message: "Restaurant deleted successfully" };
   } catch (error) {
      throw new Error(error.message);
   }
}

const getAllRestaurants = async () => {
   try {
      const restaurants = await Restaurant.find()
         .populate('address')
         .populate('owner')
         .populate('foods');
      return restaurants;
   } catch (error) {
      throw new Error(error.message);
   }
}

const searchRestaurant = async (keyword) => {
   try {
      const restaurant = await Restaurant.find({
         $or: [
            { name: {$regex: keyword, $options: 'i'} },
            { description: {$regex: keyword, $options: 'i'} },
            { cuisineType: {$regex: keyword, $options: 'i'} }
         ]
      }).populate('address')
        .populate('owner')
        .populate('foods');

      return restaurant;
   } catch (error) {
      throw new Error(error.message);
   }
}

const addToFavourite = async (restaurantId, user) => {
   try {
      const restaurant = await findRestaurantById(restaurantId);
      const dto = {
         _id: restaurant._id,
         name: restaurant.name,
         description: restaurant.description,
         images: restaurant.images
      }

      const favorites = user.favourites || [];
      const index = favorites.findIndex(fav => fav._id.toString() === restaurantId.toString());

      if(index !== -1){
         favorites.splice(index, 1);
      } else {
         favorites.push(dto);
      }

      user.favourites = favorites;
      await user.save();
      return dto;
   } catch (error) {
      throw new Error(error.message);
   }
}

const updateRestaurantStatus = async (id) => {
   try {
      const restaurant = await Restaurant.findById(id)
         .populate('owner')
         .populate('address')
         .populate('foods')
         .populate('orders');

      if(!restaurant) {
         throw new Error('Restaurant not found');
      }

      restaurant.open = !restaurant.open;
      await restaurant.save();
      return restaurant;
   } catch (error) {
      throw new Error(error.message);
   }
}

const updateRestaurantRating = async (restaurantId, rating) => {
   try {
      const restaurant = await findRestaurantById(restaurantId);
      
      restaurant.numRating = rating;
      await restaurant.save();
      
      return restaurant;
   } catch (error) {
      throw new Error(error.message);
   }
}

const getRestaurantOrders = async (restaurantId, status) => {
   try {
      const restaurant = await findRestaurantById(restaurantId);
      
      let query = { restaurant: restaurantId };
      if (status) {
         query.orderStatus = status;
      }

      const orders = await Order.find(query)
         .populate('customer')
         .populate('items')
         .populate('deliveryAddress')
         .sort({ createdAt: -1 });

      return orders;
   } catch (error) {
      throw new Error(error.message);
   }
}

const updateRestaurantOrderStatus = async (restaurantId, orderId, status) => {
   try {
      const restaurant = await findRestaurantById(restaurantId);
      const order = await Order.findById(orderId);

      if (!order) {
         throw new Error('Order not found');
      }

      if (order.restaurant.toString() !== restaurantId) {
         throw new Error('Order does not belong to this restaurant');
      }

      order.orderStatus = status;
      await order.save();

      return order;
   } catch (error) {
      throw new Error(error.message);
   }
}

module.exports = {
   createRestaurant,
   getAllRestaurants,
   deleteRestaurant,
   findRestaurantById,
   addToFavourite,
   updateRestaurantStatus,
   searchRestaurant,
   getRestaurantByUserId,
   updateRestaurant,
   updateRestaurantRating,
   getRestaurantOrders,
   updateRestaurantOrderStatus
}