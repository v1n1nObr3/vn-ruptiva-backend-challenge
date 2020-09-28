import { RequestHandler } from 'express'

const isAuthMiddleware: RequestHandler = (req, res, next) => {
  if (!req.session!.userID) res.status(401)
  else return next()
}

export default isAuthMiddleware
