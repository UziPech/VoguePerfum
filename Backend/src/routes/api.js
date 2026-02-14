const express = require('express');
const router = express.Router();

// CQRS Handlers
// Auth
const loginUser = require('../features/auth/commands/loginUser');
const registerUser = require('../features/auth/commands/registerUser');

// Catalog
const getCategories = require('../features/catalog/queries/getCategories');
const getProducts = require('../features/catalog/queries/getProducts');
const getProduct = require('../features/catalog/queries/getProduct');
const createCategory = require('../features/catalog/commands/createCategory');
// Product imports
const createProduct = require('../features/catalog/commands/createProduct');
const updateProduct = require('../features/catalog/commands/updateProduct');
const deleteProduct = require('../features/catalog/commands/deleteProduct');
const deleteCategory = require('../features/catalog/commands/deleteCategory');
const updateCategory = require('../features/catalog/commands/updateCategory');

// Brands
const getBrands = require('../features/brands/queries/getBrands');
const createBrand = require('../features/brands/commands/createBrand');
const getDashboardStats = require('../features/dashboard/queries/getDashboardStats');

// Middleware
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Dashboard Routes
router.get('/dashboard/stats', getDashboardStats);
const getActivityLogs = require('../features/dashboard/queries/getActivityLogs');
router.get('/dashboard/activity-logs', authenticateUser, requireAdmin, getActivityLogs);

// Catalog Routes
router.get('/categories', getCategories);
router.post('/categories', authenticateUser, requireAdmin, createCategory);
router.put('/categories/:id', authenticateUser, requireAdmin, updateCategory);
router.delete('/categories/:id', authenticateUser, requireAdmin, deleteCategory);

router.get('/brands', getBrands);
router.post('/brands', authenticateUser, requireAdmin, createBrand);

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', authenticateUser, requireAdmin, createProduct);
router.put('/products/:id', authenticateUser, requireAdmin, updateProduct);
router.delete('/products/:id', authenticateUser, requireAdmin, deleteProduct);

// Commerce Features
const createReview = require('../features/reviews/commands/createReview');
const getProductReviews = require('../features/reviews/queries/getProductReviews');

const addToWishlist = require('../features/wishlist/commands/addToWishlist');
const removeFromWishlist = require('../features/wishlist/commands/removeFromWishlist');
const getWishlist = require('../features/wishlist/query/getWishlist');

const addToCart = require('../features/cart/commands/addToCart');
const updateCartItem = require('../features/cart/commands/updateCartItem');
const removeFromCart = require('../features/cart/commands/removeFromCart');
const getCart = require('../features/cart/queries/getCart');

// Reviews Routes
router.post('/reviews', authenticateUser, createReview);
router.get('/products/:productId/reviews', getProductReviews);

// Wishlist Routes
router.get('/wishlist', authenticateUser, getWishlist);
router.post('/wishlist', authenticateUser, addToWishlist);
router.delete('/wishlist/:productId', authenticateUser, removeFromWishlist);

// Cart Routes
router.get('/cart', authenticateUser, getCart);
router.post('/cart', authenticateUser, addToCart);
router.put('/cart/:productId', authenticateUser, updateCartItem);
router.delete('/cart/:productId', authenticateUser, removeFromCart);

module.exports = router;
