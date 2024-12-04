const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    thumbnail: String,
    mobile: String,
    tablet: String,
    desktop: String,
  },
});

module.exports = mongoose.model('Product', ProductSchema);