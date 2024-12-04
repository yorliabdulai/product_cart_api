const request = require('supertest');
const app = require('../app');

describe('Product Endpoints', () => {
  it('should fetch all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should fetch a single product by ID', async () => {
    const productId = 'some-valid-id'; // Replace with a valid ID
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name');
  });
});
