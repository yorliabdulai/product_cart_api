const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

describe('Product API', () => {
  it('should retrieve all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should filter products by category', async () => {
    const response = await request(app).get('/products?category=Waffle');
    expect(response.status).toBe(200);
    expect(response.body.every((prod) => prod.category === 'Waffle')).toBe(true);
  });

  it('should search products by name', async () => {
    const response = await request(app).get('/products?search=Waffle');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
