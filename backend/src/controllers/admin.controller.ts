// controllers/adminAuth.controller.ts
import { Request, Response, NextFunction } from 'express'
import { Admin } from '../models/admin.model'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  try {
    const admin = await Admin.findOne({ username })
    if (!admin) {
      throw new ApiError(401, 'Invalid credentials')
    }

    const isMatch = await admin.isPasswordCorrect(password)
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }

    const token = jwt.sign({ adminId: admin._id }, secret, { expiresIn: '4h' })
    res.cookie('token', token)
    res
      .status(200)
      .json(new ApiResponse(200, { admin, token }, 'Login successful'))
  } catch (error) {
    next(new ApiError(500, (error as Error).message))
  }
}

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  try {
    const admin = await Admin.findOne()
    if (!admin) {
      throw new ApiError(404, 'Admin not found')
    }

    if (username) {
      admin.username = username
    }

    if (password) {
      admin.password = await bcrypt.hash(password, 10)
    }

    await admin.save()
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          admin.populate('-password'),
          'Admin updated successfully'
        )
      )
  } catch (error) {
    next(new ApiError(500, (error as Error).message))
  }
}

export { loginAdmin, updateAdmin }
