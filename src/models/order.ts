// ORDER MODEL
import Client from '../database'

/*
Current Order by user (args: user id)[token required]
*/

export type Order = {
  id: number
  status: string
  user_id: number
}

export class OrderModel {
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const connection = await Client.connect()
      const sql = 'SELECT * FROM orders ORDER BY user_id'
      const result = await connection.query(sql)
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(`could not get orders: ${error}`)
    }
  }

  async show(userId: string): Promise<Order[]> {
    // Meet requirements : Current Order by user (args: user id)[token required]
    // todo : check if user is found in database
    // get user seeing if it is exist
    try {
      const userSql = 'SELECT * FROM users WHERE id=($1)'
      //@ts-ignore
      const conn = await Client.connect()
      const result = await conn.query(userSql, [userId])
      const user = result.rows[0]
      if (user) {
        throw new Error(
          `Could not get orders for user ${userId} because user does not exist`
        )
      }
      conn.release()
    } catch (err) {
      throw new Error(`${err}`)
    }

    try {
      // @ts-ignore
      const connection = await Client.connect()
      const sql = 'SELECT * FROM orders WHERE id = $1 AND user_id = $2'
      const result = await connection.query(sql, [userId])
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(`could not get user ${userId} orders: ${error}`)
    }
  }

  async create(data: Order): Promise<Order> {
    try {
      // @ts-ignore
      const connection = await Client.connect()
      const sql =
        'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *'
      const result = await connection.query(sql, [data.status, data.user_id])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`could not create order: ${error}`)
    }
  }

  // We added the method to attach a product to and order in the order model.
  //making sure the order is open and can have new products
  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    // get order seeing if it is open
    try {
      const orderSql = 'SELECT * FROM orders WHERE id=($1)'
      //@ts-ignore
      const conn = await Client.connect()
      const result = await conn.query(orderSql, [orderId])
      const order = result.rows[0]
      if (order.status !== 'open') {
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        )
      }
      conn.release()
    } catch (err) {
      throw new Error(`${err}`)
    }

    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      //@ts-ignore
      const conn = await Client.connect()
      const result = await conn.query(sql, [quantity, orderId, productId])
      const order = result.rows[0]
      conn.release()
      return order
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      )
    }
  }
}
