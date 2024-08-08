import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../utilities/ErrorHandler'

interface AuthRequest extends Request {
  user?: { userId: string }
}
const authenticate = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.token || req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return next(new ApiError(401, 'No token provided, authorization denied'))
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }

    const decoded = jwt.verify(token, secret) as { userId: string }

    req.user = { userId: decoded.userId }
    next()
  } catch (err) {
    return next(new ApiError(401, 'Token is not valid'))
  }
}

export default authenticate
