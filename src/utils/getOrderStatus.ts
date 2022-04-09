import Client from '../database'

export async function orderIsOpen(orderId: string): Promise<boolean> {
  //get order status
  try {
    const orderSql = 'SELECT * FROM orders WHERE id=($1)'
    const conn = await Client.connect()
    const result = await conn.query(orderSql, [orderId])
    const order = result.rows[0]
    if (order) {
      return order.status === 'open'
    } else {
      return false
    }
  } catch (error) {
    throw new Error(`Error getting order status: ${error}`)
  }
}
