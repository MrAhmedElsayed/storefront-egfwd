import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User, UserStore } from "../models/user";

const userRoutes = (app: express.Application) => {
  app.get("/users", index);
  app.get("/users/{:id}", show);
  app.post("/users", create);
  app.delete("/users", destroy);
  app.post("/users/authenticate", authenticate);
};

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (_req: Request, res: Response) => {
  const user = await store.show(_req.body.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json((err as string) + user);
  }
};

const update = async (req: Request, res: Response) => {
  const user: User = {
    id: req.params.id,
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    if (decoded.id !== user.id) {
      throw new Error("User id does not match!");
    }
  } catch (err) {
    res.status(401);
    res.json(err);
    return;
  }

  try {
    const updated = await store.create(user);
    res.json(updated);
  } catch (err) {
    res.status(400);
    res.json((err as string) + user);
  }
};

const destroy = async (_req: Request, res: Response) => {
  const deleted = await store.delete(_req.body.id);
  res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const u = await store.authenticate(user.username, user.password);
    var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (error) {
    res.status(401);
    res.json({ error });
  }
};

// And if you created a custom middleware for this - great job! You can even create a
//  few different middlewares for different levels of authorization needed - 
// for instance one middleware to look for a valid token and another to check for 
// an admin role on the user, or to check if they are trying to edit a page they 
// don't own.
export default userRoutes;
