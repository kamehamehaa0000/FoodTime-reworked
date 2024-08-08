import { NextFunction, Request, Response, RequestHandler } from 'express'
const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch(next)
  }
}

export default asyncHandler
