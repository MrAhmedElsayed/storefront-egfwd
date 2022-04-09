// ORDER HANDLERS
import express, { Request, Response } from 'express'
import { Order, OrderModel } from '../models/order'

const store = new OrderModel()

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/user/:userId/orders', show)
  app.post('/orders', create)

  //    add products to order
  app.post('/orders/:orderId/products', addProduct)
}

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.userId)
    console.log(req.params.userId)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({
        message: `user with id ${req.params.userId} not found or has no orders`
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error,
      })
    } else {
      res.status(400).json({
        message: error,
      })
    }
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

const addProduct = async (req: Request, res: Response) => {
  try {
    const order = await store.addProduct(
      parseInt(req.body.quantity),
      req.params.orderId,
      req.body.product_id.toString()
    )
    res.json(order)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

export default orderRoutes
