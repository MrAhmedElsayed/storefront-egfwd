import supertest from 'supertest'
import app from '../../server'
import { Order, OrderModel } from '../../models/order'
import Client from '../../database'
import { User, UserStore } from '../../models/user'
import { generateToken } from '../../utils/generateToken'

const request = supertest(app)

const user_store = new UserStore()
const order_store = new OrderModel()

describe('The Orders End-Points', () => {
  // First: check if the endpoints is defined
  it('should have an create method', () => {
    expect(order_store.create).toBeDefined()
  })
  it('should have an index method', () => {
    expect(order_store.index).toBeDefined()
  })
  it('should have an show method', () => {
    expect(order_store.show).toBeDefined()
  })

  let token: string
  let created_user_id: number

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
    created_user_id = createUser.id as number
  })

  //    Current Order by user (args: user id)[token required]
  it('should return the current order "open status" of the user', async () => {
    const order: Order = {
      status: 'open',
      user_id: created_user_id,
    }
    const createOrder = await order_store.create(order)
    const response = await request
      .get(`/user/${created_user_id}/orders`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body[0].id).toBe(createOrder.id)
    expect(response.body[0]).toEqual(createOrder)
  })

  // empty the database
  afterAll(async () => {
    const connection_pool = await Client.connect()
    await connection_pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await connection_pool.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1')
    await connection_pool.query('TRUNCATE TABLE orders CASCADE')
    await connection_pool.query('TRUNCATE TABLE users CASCADE')
    await connection_pool.release()
  })
})
