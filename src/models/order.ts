import Client from '../database'

export type Order = {
  id?: number
  status: string
  user_id?: number
}

export class OrderModel {
  async index(): Promise<Order[]> {
    try {
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
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM orders WHERE user_id = $1'
      const result = await connection.query(sql, [userId])
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(`could not get user ${userId} orders: ${error}`)
    }
  }

  async create(data: Order): Promise<Order> {
    try {
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
  async addProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<Order> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
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
