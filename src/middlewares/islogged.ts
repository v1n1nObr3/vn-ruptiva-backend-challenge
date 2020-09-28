import { RequestHandler } from 'express'

const isLoggedMiddleware: RequestHandler = (req, res) => {
  if (req.session!.userID) res.status(200).json(true)
  else res.status(200).json(false)
}

export default isLoggedMiddleware
