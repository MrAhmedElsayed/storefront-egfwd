import supertest from 'supertest'
import app from '../../server'

const request = supertest(app)

// add test for get all products
describe('GET /products', () => {
  it('should return all products', async () => {
    const res = await request.get('/products')
    expect(res.status).toBe(200)
  })
})
