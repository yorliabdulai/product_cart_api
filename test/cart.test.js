const request = require('supertest');
const app = require('../app');

describe('Cart Endpoints', () => {
  it('should fetch the user cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', 'Bearer some-valid-token'); // Replace with valid token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
  });

  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({ productId: 'some-product-id', quantity: 2 })
      .set('Authorization', 'Bearer some-valid-token'); // Replace with valid token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
  });
});
