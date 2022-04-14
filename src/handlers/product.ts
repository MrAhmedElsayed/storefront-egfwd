import express, { Request, Response } from 'express'
import { Product, ProductModel } from '../models/product'
import { isOrderBelongToUser, isUserExist } from '../utils/isModelExist'
import { verifyAuthToken } from '../middlewares/verifyAuthTokenMIDD'

/*
--- Products ---
Index
Show
Create [token required]
*/

const store = new ProductModel()

const productRoutes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:productId', show)
  app.post('/products', verifyAuthToken, create)
  // show how the product belongs to a single order.
  // If we were to add a user as an owner of the order
  app.get('/user/:userID/orders/:orderID/products', userOrderProducts)
}

const index = async (_req: Request, res: Response) => {
  const products = await store.index()
  if (products) {
    res.status(200).json(products)
  } else {
    res.status(404).json({ message: 'No products found' })
  }
}

const show = async (_req: Request, res: Response) => {
  const product = await store.show(_req.params.productId)
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({
      message: `Product with id = (${_req.params.productId}) not found`,
    })
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
    }

    const createProduct = await store.create(product)
    res.json(createProduct)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error })
    } else {
      res.status(400).json({ error: error })
    }
  }
}

const userOrderProducts = async (req: Request, res: Response) => {
  const userExist = await isUserExist(req.params.userID)
  const orderBelongToUser = await isOrderBelongToUser(
    req.params.orderID,
    req.params.userID
  )

  if (!userExist || !orderBelongToUser) {
    res.status(404).json({
      message: `User with id = (${req.params.userID}) or order with id = (${req.params.orderID}) not found`,
    })
  } else {
    try {
      const products = await store.userOrderProducts(
        req.params.userID,
        req.params.orderID
      )
      res.json(products)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(400).json({ error: error })
      }
    }
  }
}

export default productRoutes
