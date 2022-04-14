import { UserStore } from '../../models/user'
import Client from '../../database'

const store = new UserStore()

describe('User Model', () => {
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
    expect(store.authenticate).toBeDefined()
  })

  it('create method should add a product', async () => {
    const result = await store.create({
      username: 'sarah',
      first_name: 'sara',
      last_name: 'Ali',
      password: '123456',
    })
    expect(result.id).toEqual(1)
    expect(result.username).toEqual('sarah')
    expect(result.first_name).toEqual('sara')
    expect(result.last_name).toEqual('Ali')
  })

  it('index method should return a list of products', async () => {
    const result = await store.index()
    expect(result.length).toEqual(1)
    expect(result[0].id).toEqual(1)
    expect(result[0].username).toEqual('sarah')
    expect(result[0].first_name).toEqual('sara')
    expect(result[0].last_name).toEqual('Ali')
  })

  it('show method should return the correct product', async () => {
    const result = await store.show('1')
    expect(result.id).toEqual(1)
    expect(result.username).toEqual('sarah')
    expect(result.first_name).toEqual('sara')
    expect(result.last_name).toEqual('Ali')
  })

  // clear a table in PostgreSQL
  afterAll(async () => {
    //todo: try to connect and then release the connection and end client
    const connection_pool = await Client.connect()
    await connection_pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await connection_pool.query('TRUNCATE TABLE users CASCADE')
    connection_pool.release()
  })
})
