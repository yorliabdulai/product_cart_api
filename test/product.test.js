const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');

describe('Product API', () => {
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
    // Create a test product before each test
    testProduct = new Product({
      name: 'Test Dessert',
      category: 'Test Category',
      price: 9.99,
      image: {
        thumbnail: 'test-thumbnail.jpg',
        mobile: 'test-mobile.jpg',
        tablet: 'test-tablet.jpg',
        desktop: 'test-desktop.jpg'
      }
    });
    await testProduct.save();
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /products', () => {
    it('should retrieve all products', async () => {
      const response = await request(app).get('/products');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /products/:id', () => {
    it('should retrieve a specific product', async () => {
      const response = await request(app).get(`/products/${testProduct._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Test Dessert');
      expect(response.body.price).toBe(9.99);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/products/${fakeId}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Dessert',
        category: 'New Category',
        price: 7.50,
        image: {
          thumbnail: 'new-thumbnail.jpg',
          mobile: 'new-mobile.jpg',
          tablet: 'new-tablet.jpg',
          desktop: 'new-desktop.jpg'
        }
      };

      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct);

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe('New Dessert');
    });

    it('should reject product creation without authentication', async () => {
      const newProduct = {
        name: 'Unauthorized Dessert',
        category: 'Test Category',
        price: 6.99,
        image: {
          thumbnail: 'unauthorized-thumbnail.jpg'
        }
      };

      const response = await request(app)
        .post('/products')
        .send(newProduct);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Dessert',
        price: 10.99
      };

      const response = await request(app)
        .put(`/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe('Updated Dessert');
      expect(response.body.price).toBe(10.99);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const response = await request(app)
        .delete(`/products/${testProduct._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');

      // Verify product is actually deleted
      const checkProduct = await Product.findById(testProduct._id);
      expect(checkProduct).toBeNull();
    });
  });
});