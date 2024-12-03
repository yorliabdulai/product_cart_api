const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total: {
    type: Number,
    default: 0
  }
});

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Calculates the total price of all products in the cart.
 * 
 * Iterates over each product in the cart and sums up the total
 * price by multiplying the product price with its quantity.
 * 
 * @returns {number} The total price of all products in the cart.
 */
/******  93384741-b921-4775-9906-a6407d6cec5a  *******/
CartSchema.methods.calculateTotal = function() {
  return this.products.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Cart', CartSchema);