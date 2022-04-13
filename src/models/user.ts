import Client from '../database'
import bcrypt from 'bcrypt'

const pepper = process.env.BCRYPT_PASSWORD
const saltRounds = process.env.SALT_ROUNDS || '10'

export type User = {
  id?: number
  username: string
  first_name?: string
  last_name?: string
  password: string
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show(userId: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const conn = await Client.connect()
      const result = await conn.query(sql, [userId])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${userId}. Error: ${err}`)
    }
  }

  async create(data: User): Promise<User> {
    try {
      const connection = await Client.connect()
      const sql =
        'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *'
      const hashedPassword = bcrypt.hashSync(
        data.password + pepper,
        parseInt(saltRounds)
      )

      const result = await connection.query(sql, [
        data.username,
        data.first_name,
        data.last_name,
        hashedPassword,
      ])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`could not create product: ${error}`)
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE username=($1)'
      const conn = await Client.connect()
      const result = await conn.query(sql, [username])
      conn.release()
      const user = result.rows[0]
      if (user) {
        const isValid = bcrypt.compareSync(password + pepper, user.password)
        if (isValid) {
          return user
        }
      }
      return null
    } catch (err) {
      throw new Error(`Could not authenticate user ${username}. Error: ${err}`)
    }
  }
}
