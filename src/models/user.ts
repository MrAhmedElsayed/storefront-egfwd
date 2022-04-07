// @ts-ignore
import Client from '../database'
/*
Index [token required]
Show [token required]
Create N[token required]
*/
export type User = {
  id?: string
  username: string
  password: string
  age: number
  phone: string
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'

      // @ts-ignore
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (username, password, age, phone) VALUES($1, $2, $3, $4)'
      // @ts-ignore
      const conn = await Client.connect()

      const result = await conn.query(sql, [
        u.username,
        u.password,
        u.age,
        u.phone,
      ])

      const user = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`Could not add new user ${u.username}. Error: ${err}`)
    }
  }

  async update(id: string, u: User): Promise<User> {
    try {
      const user = await this.show(id)

      if (!user) {
        throw new Error(`Could not find user ${id}`)
      }

      const sql =
        'UPDATE users SET username = $2, password = $3, age = $4, phone = $5 WHERE id=($1)'
      // @ts-ignore
      const conn = await Client.connect()

      const result = await conn.query(sql, [
        id,
        u.username,
        u.password,
        u.age,
        u.phone,
      ])

      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${u.id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)'
      // @ts-ignore
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      const user = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`)
    }
  }
}
