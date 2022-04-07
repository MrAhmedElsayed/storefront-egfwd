// PRODUCT HANDLERS
import express, { Request, Response } from 'express'
import { Product, ProductModel } from '../models/product'

const store = new ProductModel()

const productRoutes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:productId', show)
  app.post('/products', create)
}

const index = async (_req: Request, res: Response) => {
  const products = await store.index()
  res.json(products)
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

// todo ask for token
const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
    }

    const createProduct = await store.create(product)
    res.json(createProduct)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

export default productRoutes
