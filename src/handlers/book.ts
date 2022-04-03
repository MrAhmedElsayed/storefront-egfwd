import express, { Request, Response } from 'express'
import { Book, BookStore } from'../models/book'


const store = new BookStore()

const index = async (_req: Request, res: Response) => {
    const books = await store.index()
    res.json(books)
}

const book_routes = (app: express.Application) => {
    app.get('/products', index)
}

// Here is an example handler file with model methods:
// import express, { Request, Response } from 'express'
// import { Article, ArticleStore } from '../models/article'
//
// const store = new ArticleStore()
//
// const index = async (_req: Request, res: Response) => {
//     const articles = await store.index()
//     res.json(articles)
// }
//
// const show = async (req: Request, res: Response) => {
//     const article = await store.show(req.body.id)
//     res.json(article)
// }
//
// const create = async (req: Request, res: Response) => {
//     try {
//         const article: Article = {
//             title: req.body.title,
//             content: req.body.content,
//         }
//
//         const newArticle = await store.create(article)
//         res.json(newArticle)
//     } catch(err) {
//         res.status(400)
//         res.json(err)
//     }
// }
//
// const destroy = async (req: Request, res: Response) => {
//     const deleted = await store.delete(req.body.id)
//     res.json(deleted)
// }
//
// const articleRoutes = (app: express.Application) => {
//     app.get('/articles', index)
//     app.get('/articles/:id', show)
//     app.post('/articles', create)
//     app.delete('/articles', destroy)
// }
//
// export default articleRoutes

// L5 (10.Authentication with JWTs)
//middleware
// const verifyAuthToken = (req: Request, res: Response, next) => {
//     try {
//         const authorizationHeader = req.headers.authorization
//         const token = authorizationHeader.split(' ')[1]
//         const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
//
//         next()
//     } catch (error) {
//         res.status(401)
//     }
// }

export default book_routes
