import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from '../../models/user'
import { generateToken } from '../../utils/generateToken'
import Client from '../../database'

const request = supertest(app)

const store = new UserStore()

xdescribe('The products End-Points', () => {
  // First: check if the endpoints is defined
  it('should have an create method', async () => {
    expect(store.create).toBeDefined()
  })

  it('should have an index method', async () => {
    expect(store.index).toBeDefined()
  })

  it('should have an show method', async () => {
    expect(store.show).toBeDefined()
  })

  // this variable will be used to store the user token
  let token: string

  beforeAll(async () => {
    const user: User = {
      username: 'ahmed',
      first_name: 'ahmed',
      last_name: 'el-sayed',
      password: '123',
    }
    const createUser = await store.create(user)
    // Create a token before starting the tests to use it in the backend
    token = await generateToken(createUser)
  })

  it('should create product', async () => {
    const res = await request
      .post('/products')
      .send({
        name: 'test product',
        price: 100,
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 1, name: 'test product', price: 100 })
  })

  it('should get all products', async () => {
    const res = await request.get('/products')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: 1, name: 'test product', price: 100 }])
  })

  it('should get a product', async () => {
    const res = await request.get('/products/1')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 1, name: 'test product', price: 100 })
  })

  // after all drop "test" database tables
  afterAll(async () => {
    await Client.query(
      'DROP TABLE IF EXISTS migrations , users, products, orders, order_products'
    )
  })
})
