import { Request, Response } from 'express'
import Reservation from '../models/reservation.model'
import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'
import Restaurant from '../models/restaurant.model'

interface AuthRequest extends Request {
  user?: { userId: string }
}
const addReservation = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    const madeBy = (req as AuthRequest).user?.userId

    const { time, date, phoneNumber, heads } = req.body

    if (!time || !madeBy || !phoneNumber || !date || !heads) {
      throw new ApiError(400, 'All fields required')
    }

    const restaurant = await Restaurant.findOne()
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found')
    }

    if (restaurant.bookedSlots >= restaurant.totalSlots) {
      throw new ApiError(400, 'No slots available for reservation')
    }

    const reservation = await Reservation.create({
      time,
      date,
      madeBy,
      phoneNumber,
      heads,
    })

    if (!reservation) {
      throw new ApiError(500, 'Reservation failed')
    }

    restaurant.bookedSlots++
    await restaurant.save()

    res
      .status(201)
      .json(new ApiResponse(200, reservation, 'Reservation made successfully'))
  }
)

const deleteReservation = asyncHandler(async (req: Request, res: Response) => {
  const resID = req.params.resID

  if (!resID) {
    throw new ApiError(400, 'Reservation ID is required')
  }

  const delReservation = await Reservation.findByIdAndDelete(resID)
  if (!delReservation) {
    throw new ApiError(400, 'Reservation does not exist')
  }

  const restaurant = await Restaurant.findOne({})
  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found')
  }

  restaurant.bookedSlots--
  await restaurant.save()

  res
    .status(200)
    .json(
      new ApiResponse(200, delReservation, 'Reservation deleted successfully')
    )
})

const getAllReservationById = asyncHandler(
  async (req: Request | AuthRequest, res: Response) => {
    const userID = (req as AuthRequest).user?.userId

    if (!userID) {
      throw new ApiError(400, 'User info is required')
    }

    const reservations = await Reservation.find({ madeBy: userID })
    if (!reservations.length) {
      throw new ApiError(400, 'No reservations found')
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, reservations, 'Successfully listed reservations')
      )
  }
)

const getAllReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservations = await Reservation.find()
  if (!reservations.length) {
    throw new ApiError(400, 'No reservations found')
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, reservations, 'Successfully listed reservations')
    )
})

export {
  addReservation,
  deleteReservation,
  getAllReservationById,
  getAllReservation,
}
