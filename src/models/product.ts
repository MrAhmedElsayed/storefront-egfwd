import Client from '../database'

export type Product = {
  id?: number
  name: string
  price: number
}

export class ProductModel {
  async index(): Promise<Product[]> {
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM products'
      const result = await connection.query(sql)
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(`could not get products: ${error}`)
    }
  }

  async show(productId: string): Promise<Product> {
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM products WHERE id = $1'
      const result = await connection.query(sql, [productId])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`could not get product: ${error}`)
    }
  }

  async create(data: Product): Promise<Product> {
    try {
      const connection = await Client.connect()
      const sql =
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *'
      const result = await connection.query(sql, [data.name, data.price])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`could not create product: ${error}`)
    }
  }

  async userOrderProducts(userID: string, orderID: string): Promise<Product[]> {
    //show how the product belongs to a single order. If we were to add a user as an owner of the order
    try {
      const connection = await Client.connect()
      const sql =
        'SELECT * FROM products INNER JOIN order_products ON products.id = order_products.product_id WHERE order_id= $1;'
      const result = await connection.query(sql, [orderID])
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(`could not get product: ${error}`)
    }
  }
}
