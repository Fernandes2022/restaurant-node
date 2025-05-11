/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Restaurants
 *     description: Restaurant management endpoints
 *   - name: Customer Restaurants
 *     description: Restaurant endpoints for customers
 *   - name: Food (Admin)
 *     description: Food item management for restaurants
 *   - name: Food (Customer)
 *     description: Food menu endpoints for customers
 *   - name: Category
 *     description: Category endpoints
 *   - name: Admin - Ingredients
 *     description: Admin Ingredient management 
 *   - name: Order (Restaurant)
 *     description: Order management for restaurant admins
 *   - name: Order (User)
 *     description: Order creation for users
 *   - name: Events
 *     description: Creating restaurants events
 *   - name: Contact
 *     description: Contact form endpoints
 *   - name: Cart
 *     description: Shopping cart management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - cuisineType
 *         - address
 *         - contactInformation
 *         - openingHours
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the restaurant
 *         description:
 *           type: string
 *           description: Description of the restaurant
 *         cuisineType:
 *           type: string
 *           description: Type of cuisine served
 *         address:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             fullName:
 *               type: string
 *             postalCode:
 *               type: string
 *             state:
 *               type: string
 *             streetAddress:
 *               type: string
 *         contactInformation:
 *           type: object
 *           description: Contact details of the restaurant
 *         openingHours:
 *           type: string
 *           description: Restaurant operating hours
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         open:
 *           type: boolean
 *           description: Whether the restaurant is currently open
 *         numRating:
 *           type: number
 *           description: Restaurant rating
 *     Order:
 *       type: object
 *       required:
 *         - customer
 *         - restaurant
 *         - items
 *         - deliveryAddress
 *       properties:
 *         orderStatus:
 *           type: string
 *           enum: [PENDING, COMPLETED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *         totalAmount:
 *           type: number
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               food:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *         deliveryAddress:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             country:
 *               type: string
 *             fullName:
 *               type: string
 *             postalCode:
 *               type: string
 *             state:
 *               type: string
 *             streetAddress:
 *               type: string
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent to email
 */

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully reset
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized – Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 *   put:
 *     summary: Update restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       400:
 *         description: Invalid input
 *   delete:
 *     summary: Delete restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/restaurants/myrestaurant:
 *   get:
 *     summary: Get restaurant by authenticated user ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant found
 *       404:
 *         description: Restaurant not found
 */

/**
 * @swagger
 * /api/restaurants/{id}/status:
 *   patch:
 *     summary: Toggle restaurant open/close status
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant status updated successfully
 */

/**
 * @swagger
 * /api/restaurants/search:
 *   get:
 *     summary: Search restaurants by name or description
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search restaurants by name or description
 *     responses:
 *       200:
 *         description: List of matching restaurants
 */

/**
 * @swagger
 * /api/restaurants/{id}/add-favourites:
 *   get:
 *     summary: Add or remove a restaurant from user's favourites
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favourite toggled successfully
 */

/**
 * @swagger
 * /api/restaurants/{id}/orders:
 *   get:
 *     summary: Get restaurant orders
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: List of restaurant orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/restaurants/{id}/orders/{orderId}:
 *   put:
 *     summary: Update order status
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/restaurants/search:
 *   get:
 *     summary: Search restaurants by name or description
 *     tags: [Customer Restaurants]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search restaurants by name or description
 *     responses:
 *       200:
 *         description: List of matching restaurants
 */

/**
 * @swagger
 * /api/restaurants/{id}/add-favourites:
 *   get:
 *     summary: Add or remove a restaurant from user's favourites
 *     tags: [Customer Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favourite toggled successfully
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Customer Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get details of a restaurant by ID
 *     tags: [Customer Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details retrieved successfully
 */

/**
 * @swagger
 * /api/admin/events/restaurant/{restaurantId}:
 *   post:
 *     summary: Create a new event for a specific restaurant
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *             properties:
 *               event:
 *                 type: object
 *                 required:
 *                   - name
 *                   - location
 *                   - image
 *                   - startedAt
 *                   - endsAt
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Wine Tasting Night
 *                   location:
 *                     type: string
 *                     example: Rooftop Hall
 *                   image:
 *                     type: string
 *                     example: https://example.com/images/event.jpg
 *                   startedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-01T18:00:00Z
 *                   endsAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-01T22:00:00Z
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad request or restaurant not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/events/restaurant/{restaurantId}:
 *   get:
 *     summary: Get all events for a specific restaurant
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: List of events
 *       400:
 *         description: Bad request or restaurant not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/event/{id}:
 *   delete:
 *     summary: Delete an event by its ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Bad request or event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 66350c865241f0a3d8e95712
 *                   name:
 *                     type: string
 *                     example: Live Jazz Night
 *                   location:
 *                     type: string
 *                     example: Main Hall
 *                   image:
 *                     type: string
 *                     example: https://example.com/image.jpg
 *                   startedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-15T20:00:00Z
 *                   endsAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-15T23:00:00Z
 *                   restaurant:
 *                     type: string
 *                     example: 66350c865241f0a3d8e94420
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/food/create:
 *   post:
 *     summary: Create a new food item (Admin only)
 *     tags: [Food (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - ingredients
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jollof Rice"
 *               description:
 *                 type: string
 *                 example: "Spicy party-style jollof rice"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg"]
 *               price:
 *                 type: number
 *                 example: 2500
 *               fooCategory:
 *                 type: string
 *                 example: "661234abc123abc123abc123"  # ObjectId of category
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "660aaa111111111111111111"  # ObjectId of ingredient
 *               isSeasonal:
 *                 type: boolean
 *                 example: false
 *               isVegetarian:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Food item created successfully
 *       400:
 *         description: Invalid input or no restaurant found for admin
 *       401:
 *         description: Unauthorized - Admin authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/food/{id}:
 *   delete:
 *     summary: Delete a food item by ID
 *     tags: [Food (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food item ID
 *     responses:
 *       200:
 *         description: Food item deleted successfully
 */

/**
 * @swagger
 * /api/admin/food/status/{id}:
 *   put:
 *     summary: Toggle availability status of a food item
 *     tags: [Food (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food item ID
 *     responses:
 *       200:
 *         description: Availability status updated
 */

/**
 * @swagger
 * /api/food/search:
 *   get:
 *     summary: Search for food items by name or category
 *     tags: [Food (Customer)]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Keyword to search in food name or category
 *     responses:
 *       200:
 *         description: List of matching food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */

/**
 * @swagger
 * /api/food/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu items of a specific restaurant
 *     tags: [Food (Customer)]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the restaurant
 *       - in: query
 *         name: vegetarian
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter vegetarian items
 *       - in: query
 *         name: nonveg
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter non-vegetarian items
 *       - in: query
 *         name: seasonal
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter seasonal items
 *       - in: query
 *         name: food_category
 *         schema:
 *           type: string
 *         description: Filter by food category
 *     responses:
 *       200:
 *         description: List of menu items for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */

/**
 * @swagger
 * /api/admin/order/{orderId}:
 *   delete:
 *     summary: Cancel an order by ID
 *     tags: [Order (Restaurant)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/order/restaurant/{restaurantId}:
 *   get:
 *     summary: Get all orders for a specific restaurant
 *     tags: [Order (Restaurant)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID to fetch orders for
 *       - in: query
 *         name: orderStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *         description: Optional filter by order status
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/order/{orderId}/{orderStatus}:
 *   put:
 *     summary: Update order status by order ID
 *     tags: [Order (Restaurant)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update
 *       - in: path
 *         name: orderStatus
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *         description: New order status to set
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     summary: Create a new category for the authenticated user's restaurant
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Drinks
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 restaurant:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., missing name or restaurant not found)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/category/restaurant/{id}:
 *   get:
 *     summary: Get all categories by restaurant ID
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   restaurant:
 *                     type: string
 *       400:
 *         description: Invalid restaurant ID or error retrieving categories
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/category/restaurant/{id}:
 *   get:
 *     summary: Get all categories by restaurant ID
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   restaurant:
 *                     type: string
 *       400:
 *         description: Invalid restaurant ID or error retrieving categories
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/ingredients/category:
 *   post:
 *     summary: Create a new ingredient category for a restaurant
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Vegetables
 *               restaurantId:
 *                 type: string
 *                 example: 664b0f89c289eac1a346f421
 *     responses:
 *       200:
 *         description: Ingredient category created
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/ingredients:
 *   post:
 *     summary: Create a new ingredient item under a specific category and restaurant
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ingredientCategoryId
 *               - restaurantId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tomato
 *               ingredientCategoryId:
 *                 type: string
 *                 example: 664b0f89c289eac1a346f427
 *               restaurantId:
 *                 type: string
 *                 example: 664b0f89c289eac1a346f421
 *     responses:
 *       200:
 *         description: Ingredient item created
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/ingredients/{id}/stock:
 *   put:
 *     summary: Toggle the stock status of an ingredient item
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the ingredient item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient stock status updated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/ingredients/restaurant/{id}:
 *   get:
 *     summary: Get all ingredient items for a specific restaurant
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ingredient items
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/ingredients/restaurant/{id}/category:
 *   get:
 *     summary: Get all ingredient categories for a specific restaurant
 *     tags: [Admin - Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ingredient categories
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order from the user's cart
 *     tags: [Order (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - deliveryAddress
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 description: MongoDB ObjectId of the restaurant
 *                 example: "6644fd6c23f0f945b8253b2e"
 *               deliveryAddress:
 *                 type: object
 *                 description: Delivery address for the order
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zip
 *                   - country
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main Street"
 *                   city:
 *                     type: string
 *                     example: "Lagos"
 *                   state:
 *                     type: string
 *                     example: "Lagos State"
 *                   zip:
 *                     type: string
 *                     example: "100001"
 *                   country:
 *                     type: string
 *                     example: "Nigeria"
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6644fd6c23f0f945b8253b2e"
 *                 restaurant:
 *                   type: string
 *                   example: "6644fd6c23f0f945b8253b2e"
 *                 user:
 *                   type: string
 *                   example: "6644fd6c23f0f945b8253b2e"
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       food:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                       quantity:
 *                         type: integer
 *                 totalAmount:
 *                   type: number
 *                   example: 1500
 *                 status:
 *                   type: string
 *                   enum: [PENDING, COMPLETED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *                   example: "PENDING"
 *                 deliveryAddress:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zip:
 *                       type: string
 *                     country:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input or cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cart is empty"
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/user:
 *   get:
 *     summary: Get all orders placed by the authenticated user
 *     tags: [Order (User)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sender's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Sender's email address
 *               subject:
 *                 type: string
 *                 description: Message subject
 *               message:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/cart/add:
 *   put:
 *     summary: Add an item to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuItemId
 *             properties:
 *               menuItemId:
 *                 type: string
 *                 description: ID of the food item to add
 *                 example: "6644fd6c23f0f945b8253b2e"
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 food:
 *                   type: string
 *                 cart:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 totalPrice:
 *                   type: number
 *       400:
 *         description: Invalid input or food item not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/total:
 *   get:
 *     summary: Calculate the total price of items in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart total calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: Total price of all items in cart
 *                   example: 1500
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the user's cart contents
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart contents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       food:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                       quantity:
 *                         type: integer
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/clear:
 *   put:
 *     summary: Clear all items from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart-item/update:
 *   put:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItemId
 *               - quantity
 *             properties:
 *               cartItemId:
 *                 type: string
 *                 description: ID of the cart item to update
 *                 example: "6644fd6c23f0f945b8253b2e"
 *               quantity:
 *                 type: integer
 *                 description: New quantity for the item
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *       400:
 *         description: Invalid input or cart item not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart-item/{id}/remove:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/restaurants/favourite/{id}:
 *   post:
 *     summary: Add or remove a restaurant from user's favourites
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favourite toggled successfully
 */