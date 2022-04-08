// ORDER HANDLERS
import express, { Request, Response } from 'express'
import { Order, OrderModel } from '../models/order'

const store = new OrderModel()

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/user/:userId/orders', show)
  app.post('/orders', create)

  //    add products to order
  app.post('/orders/:orderId/products')
}

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.userId)
    console.log(order)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({
        message: `Product with id = (${req.params.productId}) not found`,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error,
    })
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      id: req.body.id,
      status: req.body.status,
      user_id: req.body.user_id,
    }

    const createOrder = await store.create(order)
    res.json(createOrder)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

export default orderRoutes
