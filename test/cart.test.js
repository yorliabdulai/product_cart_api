const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

describe('Cart API', () => {
  let authToken;
  let testProduct;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    
    // Obtain auth token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
      });
    
    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    // Create a test product
    testProduct = new Product({
      name: 'Cart Test Dessert',
      category: 'Test Category',
      price: 9.99,
      image: {
        thumbnail: 'cart-test-thumbnail.jpg'
      }
    });
    await testProduct.save();
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await Cart.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /cart', () => {
    it('should add a product to cart', async () => {
      const response = await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          productId: testProduct._id, 
          quantity: 2 
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.products[0].quantity).toBe(2);
      expect(response.body.products[0].product.toString()).toBe(testProduct._id.toString());
    });

    it('should reject cart addition without authentication', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ 
          productId: testProduct._id, 
          quantity: 1 
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /cart', () => {
    it('should retrieve user\'s cart', async () => {
      // First, add a product to cart
      await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          productId: testProduct._id, 
          quantity: 3 
        });

      // Then retrieve the cart
      const response = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.products[0].quantity).toBe(3);
    });
  });

  describe('PUT /cart/:id', () => {
    it('should update cart item quantity', async () => {
      // First add to cart
      const addResponse = await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          productId: testProduct._id, 
          quantity: 1 
        });

      const cartItemId = addResponse.body.products[0].product;

      // Then update quantity
      const updateResponse = await request(app)
        .put(`/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 5 });

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body.products[0].quantity).toBe(5);
    });
  });

  describe('DELETE /cart/:id', () => {
    it('should remove a product from cart', async () => {
      // First add to cart
      const addResponse = await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          productId: testProduct._id, 
          quantity: 1 
        });

      const cartItemId = addResponse.body.products[0].product;

      // Then remove from cart
      const deleteResponse = await request(app)
        .delete(`/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.products.length).toBe(0);
    });
  });
});