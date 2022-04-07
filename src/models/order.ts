/*
Current Order by user (args: user id)[token required]
*/

// ORDER MODEL
// We added the method to attach a product to and order in the order model.
/*
async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [quantity, orderId, productId])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
    }
  }
*/
