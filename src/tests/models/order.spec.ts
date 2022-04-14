import { OrderModel } from '../../models/order'
import Client from '../../database'
import { UserStore } from '../../models/user'

const store = new OrderModel()
const user_store = new UserStore()

describe('Order Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have a User Products that belong to Order method', () => {
    expect(store.addProduct).toBeDefined()
  })

  let created_user_id: number
  //create user before creating order
  beforeAll(async () => {
    const testUser = await user_store.create({
      username: 'test_user',
      first_name: 'john',
      last_name: 'doe',
      password: '123',
    })
    created_user_id = testUser.id as number
  })

  it('create method should add a product', async () => {
    const result = await store.create({
      status: 'open',
      user_id: created_user_id,
    })
    expect(result.id).toEqual(1)
    expect(result.status).toEqual('open')
  })

  it('index method should return a list of products', async () => {
    const result = await store.index()
    expect(result.length).toEqual(1)
  })

  it('show method should return the correct product', async () => {
    const result = await store.show('1')
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(1)
    expect(result[0].status).toEqual('open')
  })

  // clear a table in PostgreSQL
  afterAll(async () => {
    const connection_pool = await Client.connect()
    await connection_pool.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1')
    await connection_pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await connection_pool.query('TRUNCATE TABLE users CASCADE')
    await connection_pool.query('TRUNCATE TABLE orders CASCADE')
    await connection_pool.release()
  })
})
