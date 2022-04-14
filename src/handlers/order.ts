import express, { Request, Response } from 'express'
import { Order, OrderModel } from '../models/order'
import { isUserExist } from '../utils/isModelExist'
import { orderIsOpen } from '../utils/getOrderStatus'
import { verifyAuthToken } from '../middlewares/verifyAuthTokenMIDD'
/*
Current Order by user (args: user id)[token required]
*/

const store = new OrderModel()

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/user/:userId/orders', verifyAuthToken, show)
  app.post('/user/:userId/create-order', verifyAuthToken, create)
  // add products to order
  app.post('/orders/:orderId/products', verifyAuthToken, addProduct)
}

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (req: Request, res: Response) => {
  try {
    const userExist = await isUserExist(req.params.userId)
    if (!userExist) {
      res.status(404).json({
        error: 'User not found',
      })
    } else {
      const orders = await store.show(req.params.userId)
      res.status(200).json(orders)
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error,
      })
    } else {
      res.status(400).json({
        error: error,
      })
    }
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      // id: req.body.id,
      status: req.body.status,
      user_id: parseInt(req.params.userId),
    }
    const createOrder = await store.create(order)
    res.json(createOrder)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const addProduct = async (req: Request, res: Response) => {
  //making sure the order is open and can have new products
  const orderOpen = await orderIsOpen(req.params.orderId)
  if (!orderOpen) {
    res.status(400).json(`Order is completed Or not found`)
  } else {
    try {
      const order = await store.addProduct(
        parseInt(req.body.quantity),
        req.params.orderId,
        req.body.product_id.toString()
      )
      res.json(order)
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({
          error: err,
        })
      } else {
        res.status(400).json({
          error: err,
        })
      }
    }
  }
}

export default orderRoutes
