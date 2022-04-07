// ORDER HANDLERS
import express, { Request, Response } from 'express'
import { Order, OrderModel } from '../models/order'

const store = new OrderModel()

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('user/:userId/orders', show)
  app.post('/orders')

  //    add products to order
  app.post('/orders/:orderId/products')
}

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (_req: Request, res: Response) => {
  try {
    const order = await store.show(_req.params.userId)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({
        message: `Product with id = (${_req.params.productId}) not found`,
      })
    }
  } catch (error) {
    res.status(401).json({
      message: error,
    })
  }
}

export default orderRoutes
