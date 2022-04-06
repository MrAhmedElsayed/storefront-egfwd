// USER HANDLERS
import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const store = new UserStore()

const userRoutes = (app: express.Application) => {
  app.get('/users', index)
  app.post('/users', create)
  app.get('/users/:id/', show)
  app.put('/users/:id', update)
  app.delete('/users/:id/', destroy)
}

const index = async (_req: Request, res: Response) => {
  const users = await store.index()
  res.json(users)
}

const show = async (_req: Request, res: Response) => {
  const user = await store.show(_req.params.id)
  // return error if user not found
  if (!user) {
    res.status(404).json('User not found')
  }
  res.status(200).json(user)
}

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      phone: req.body.phone,
    }

    await store
      .create(user)
      .then(() => {
        res.status(200).json(user)
      })
      .catch(() => {
        res.status(400).json('Could not Create New user')
      })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const update = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
    phone: req.body.phone,
  }
  try {
    // update user and return updated user
    await store
      .update(req.params.id, user)
      .then(() => {
        res.status(200).json(user)
      })
      .catch(() => {
        res.status(404).json(`Could not find user with id ${req.params.id}.`)
      })
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id)
    // return error if user not found
    if (!user) {
      res.status(404).json('User not found')
    }

    const deleted = await store.delete(req.params.id)
    res.json(deleted)
  } catch (error) {
    res.status(400)
    res.json({ error })
  }
}

export default userRoutes
