import supertest from 'supertest'
import app from '../../server'
import Client from '../../database'
import { User, UserStore } from '../../models/user'
import { generateToken } from '../../utils/generateToken'
import jwt from 'jsonwebtoken'
const request = supertest(app)

const user_store = new UserStore()

describe('The Orders End-Points', () => {
  // First: check if the endpoints is defined
  it('should have an create method', () => {
    expect(user_store.create).toBeDefined()
  })
  it('should have an index method', () => {
    expect(user_store.index).toBeDefined()
  })
  it('should have an show method', () => {
    expect(user_store.show).toBeDefined()
  })

  let token: string

  beforeAll(async () => {
    // I created a user like this to gain access to the endpoint by generated token
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

  // Second: check if the endpoints works
  it('should create a user', async () => {
    const endpoint_user: User = {
      username: 'ali',
      first_name: 'ali',
      last_name: 'samir',
      password: '123',
    }

    // create user from endpoint [token required]
    const response = await request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(endpoint_user)
      .expect(200)
    // note that the response is a token, so we need to decode it to get the created user
    const decode = jwt.verify(
      response.body,
      process.env.TOKEN_SECRET || 'secret'
    )
    const eval_user = eval(decode as string)
    expect(eval_user.user.username).toBe(endpoint_user.username)
    expect(eval_user.user.first_name).toBe(endpoint_user.first_name)
    expect(eval_user.user.last_name).toBe(endpoint_user.last_name)
  })

  it('should get all users', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(response.body.length).toBe(2)
  })

  it('should get a user', async () => {
    const response = await request
      .get('/users/2')
      .set('Authorization', `Bearer ${token}`)

      .expect(200)
    expect(response.body.username).toBe('ali')
  })

  // clear a table in PostgreSQL
  afterAll(async () => {
    const connection_pool = await Client.connect()
    await connection_pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await connection_pool.query('TRUNCATE TABLE users CASCADE')
    await connection_pool.release()
  })
})
