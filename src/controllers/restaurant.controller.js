const restaurantService = require('../services/restaurantService');

const createRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantService.createRestaurant(req.body, req.user);
        res.status(201).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const {id} = req.params;
        const restaurant = await restaurantService.findRestaurantById(id);
        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getRestaurantByUserId = async (req, res) => {
    try {
        const user = req.user;
        const restaurant = await restaurantService.getRestaurantByUserId(user._id);
        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const {id} = req.params;
        const restaurant = await restaurantService.updateRestaurant(id, req.body);
        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const {id} = req.params;
        await restaurantService.deleteRestaurant(id);
        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantService.getAllRestaurants();
        res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const searchRestaurants = async (req, res) => {
    try {
        const {keyword} = req.query;
        const restaurants = await restaurantService.searchRestaurant(keyword);
        res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const addToFavourite = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await restaurantService.addToFavourite(id, req.user);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateRestaurantStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const restaurant = await restaurantService.updateRestaurantStatus(id);
        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateRestaurantRating = async (req, res) => {
    try {
        const {id} = req.params;
        const restaurant = await restaurantService.updateRestaurantRating(id, req.body.rating);
        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getRestaurantOrders = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.query;
        const orders = await restaurantService.getRestaurantOrders(id, status);
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const {id, orderId} = req.params;
        const {status} = req.body;
        const order = await restaurantService.updateRestaurantOrderStatus(
            id,
            orderId,
            status
        );
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRestaurant,
    getRestaurantById,
    getRestaurantByUserId,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurants,
    searchRestaurants,
    addToFavourite,
    updateRestaurantStatus,
    updateRestaurantRating,
    getRestaurantOrders,
    updateOrderStatus
}; 