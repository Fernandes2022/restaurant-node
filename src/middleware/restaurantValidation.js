const validateRestaurant = (req, res, next) => {
    const { name, description, cuisineType, address, contactInformation, openingHours } = req.body;

    if (!name || !description || !cuisineType || !address || !contactInformation || !openingHours) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Validate address fields
    const { city, country, fullName, postalCode, state, streetAddress } = address;
    if (!city || !country || !fullName || !postalCode || !state || !streetAddress) {
        return res.status(400).json({
            success: false,
            message: "All address fields are required"
        });
    }

    // Validate contact information
    if (typeof contactInformation !== 'object' || Object.keys(contactInformation).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Contact information is required"
        });
    }

    next();
};

const validateRestaurantUpdate = (req, res, next) => {
    const { name, description, cuisineType, address, contactInformation, openingHours } = req.body;

    // Check if at least one field is being updated
    if (!name && !description && !cuisineType && !address && !contactInformation && !openingHours) {
        return res.status(400).json({
            success: false,
            message: "At least one field must be provided for update"
        });
    }

    // If address is being updated, validate its fields
    if (address) {
        const { city, country, fullName, postalCode, state, streetAddress } = address;
        if (!city || !country || !fullName || !postalCode || !state || !streetAddress) {
            return res.status(400).json({
                success: false,
                message: "All address fields are required when updating address"
            });
        }
    }

    next();
};

module.exports = {
    validateRestaurant,
    validateRestaurantUpdate
}; 