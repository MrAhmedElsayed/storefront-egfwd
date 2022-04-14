import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from '../../models/user'
import { generateToken } from '../../utils/generateToken'
import Client from '../../database'
import { ProductModel } from '../../models/product'

const request = supertest(app)

const user_store = new UserStore()
const product_store = new ProductModel()

describe('The products End-Points', () => {
  // First: check if the endpoints is defined
  it('should have an create method', async () => {
    expect(product_store.create).toBeDefined()
  })

  it('should have an index method', async () => {
    expect(product_store.index).toBeDefined()
  })

  it('should have an show method', async () => {
    expect(product_store.show).toBeDefined()
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
    const createUser = await user_store.create(user)
    // Create a token before starting the tests to use it in the backend
    token = await generateToken(createUser)
  })

  // Second: check if the endpoints is working
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

  // empty the database
  afterAll(async () => {
    const connection_pool = await Client.connect()
    await connection_pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await connection_pool.query('ALTER SEQUENCE products_id_seq RESTART WITH 1')
    await connection_pool.query('TRUNCATE TABLE users CASCADE')
    await connection_pool.query('TRUNCATE TABLE products CASCADE')
    await connection_pool.release()
  })
})
