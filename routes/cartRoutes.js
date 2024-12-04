const express = require('express');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem 
} = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.put('/:id', verifyToken, updateCartItem);
router.delete('/:id', verifyToken, removeCartItem);

module.exports = router;
