import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import { generateToken } from '../utils/generateToken'
import { verifyAuthToken } from '../middlewares/verifyAuthTokenMIDD'
/*
Index [token required]
Show [token required]
Create N[token required]
*/

const store = new UserStore()

const userRoutes = (app: express.Application) => {
  app.post('/users/login', authenticate)
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:userId/', verifyAuthToken, show)
  app.post('/users', verifyAuthToken, create)
}

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  }

  try {
    const userAuth = await store.authenticate(user.username, user.password)
    if (userAuth) {
      const token = await generateToken(userAuth)
      res.json(token)
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

const index = async (_req: Request, res: Response) => {
  const users = await store.index()
  res.json(users)
}

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.userId)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
    }

    const createUser = await store.create(user)
    const token = await generateToken(createUser)
    res.json(token)
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

export default userRoutes
