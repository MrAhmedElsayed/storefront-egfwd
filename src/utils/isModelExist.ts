import Client from '../database'

export const isUserExist = async (id: string): Promise<boolean> => {
  // check if user exist in database
  const connection = await Client.connect()
  const user = await connection.query('SELECT * FROM users WHERE id = $1', [id])
  connection.release()
  return !!user.rows[0]
}

// if order belong to user
export const isOrderBelongToUser = async (
  orderId: string,
  userId: string
): Promise<boolean> => {
  // check if order belong to user
  const connection = await Client.connect()
  const order = await connection.query(
    'SELECT * FROM orders WHERE id=$1 AND user_id = $2',
    [orderId, userId]
  )
  connection.release()
  return !!order.rows[0]
}
