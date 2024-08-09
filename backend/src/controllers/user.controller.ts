import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'
import { User } from '../models/user.model'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { z } from 'zod'
import { uploadToCloudinary } from '../utilities/cloudinaryUtils'
import { verifyGoogleToken } from '../utilities/Oauth'
interface AuthRequest extends Request {
  user?: { userId: string }
}
const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
  avatar: z.any(),
  email: z.string().email(),
})
const userSignup = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, avatar, email } = req.body
  try {
    const { success, error } = signupSchema.safeParse(req.body)
    if (!success) {
      throw new ApiError(401, `Invalid Inputs ${error}`)
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ApiError(409, 'User Already exists')
    }

    const file = (req.file as Express.Multer.File) || undefined
    const avatarLocalPath = file?.path || ''
    if (!avatarLocalPath) {
      throw new ApiError(400, 'Avatar file is required or is invalid')
    }
    const avatarUrl: string = (await uploadToCloudinary(avatarLocalPath))?.url

    const user = await User.create({
      firstName,
      lastName,
      username,
      password: password,
      avatar: avatarUrl,
      email,
    })
    const createdUser = await User.findById(user._id).select('-password')
    if (!createdUser) {
      throw new ApiError(500, 'Something went wrong while registering the user')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, 'User Registered Successfully'))
  } catch (error) {
    throw new Error(
      `Error during Signup.. User not Registered , Error =  ${error}`
    )
  }
})

const generateUniqueUsername = async (displayName: string | undefined) => {
  if (!displayName) {
    displayName = 'newUser'
  }

  displayName = displayName.split(' ')[0]
  return `${displayName}-${Math.random() * 1000}`
}
const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body
  console.log(token)
  try {
    const payload = await verifyGoogleToken(token)
    if (!payload) {
      throw new ApiError(401, 'Invalid Google token')
    }
    const {
      sub: googleId,
      email,
      given_name,
      family_name,
      name,
      picture,
    } = payload

    const username = await generateUniqueUsername(name)

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        googleId,
        username,
        firstName: given_name,
        lastName: family_name,
        email,
        avatar: picture,
      })
    } else if (!user.googleId) {
      user.googleId = googleId
      await user.save()
    }
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }

    const jwtToken = jwt.sign({ userId: user._id }, secret, {
      expiresIn: '4h',
    })
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    const resUser = await User.findOne({ email }).select([
      '-password',
      '-googleId',
    ])

    return res
      .status(200)
      .json(new ApiResponse(200, { resUser, token: jwtToken }))
  } catch (error) {
    console.log('ERROR from controller')
    throw new Error((error as Error).message)
  }
})

const getUser = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    const userId = (req as AuthRequest).user?.userId
    const user = await User.findById(userId).select('-password')
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    res
      .status(200)
      .json(new ApiResponse(200, user, 'User fetched successfully'))
  }
)

const updateUser = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    const userId = (req as AuthRequest).user?.userId
    const { username } = req.body
    const file = (req.file as Express.Multer.File) || undefined
    const avatarLocalPath = file?.path || ''
    console.log(file)
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new ApiError(404, 'User not found')
      }

      if (username) {
        user.username = username
      }

      if (avatarLocalPath) {
        const avatarUrl: string = (await uploadToCloudinary(avatarLocalPath))
          ?.url
        user.avatar = avatarUrl
      }

      await user.save()
      const updatedUser = await User.findById(userId).select('-password')
      res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'User updated successfully'))
    } catch (error) {
      throw new Error(`Error during user update, Error =  ${error}`)
    }
  }
)
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(40),
})

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const parsedData = loginSchema.safeParse(req.body)
  if (!parsedData.success) {
    throw new ApiError(401, `Invalid Inputs: ${parsedData.error.message}`)
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }
  const isMatch = await user.isPasswordCorrect(password)

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }

  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '4h' })

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })

  const userWithoutPassword = await User.findById(user._id).select('-password')

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userWithoutPassword, token },
        'User logged in successfully'
      )
    )
})
const userLogout = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log('logout ran')
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    res
      .status(200)
      .json(new ApiResponse(200, null, 'User logged out successfully'))
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong during logout' })
  }
})

const checkAuth = (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.status(200).json({ token: req.cookies.token })
  } else {
    res.status(401).json({ message: 'Not authenticated' })
  }
}

export {
  checkAuth,
  userLogout,
  userSignup,
  googleLogin,
  getUser,
  updateUser,
  userLogin,
}
