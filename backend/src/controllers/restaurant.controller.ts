import Restaurant from '../models/restaurant.model'
import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'

const updateTotalSlots = asyncHandler(async (req, res) => {
  let newSlotNumber = parseInt(req.params.newSlotNumber, 10)

  if (isNaN(newSlotNumber) || newSlotNumber < 0) {
    throw new ApiError(
      400,
      'Invalid slot number. It must be a non-negative number.'
    )
  }

  const restaurant = await Restaurant.findOneAndUpdate(
    {},
    { totalSlots: newSlotNumber },
    { new: true }
  )

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found')
  }

  res
    .status(200)
    .json(new ApiResponse(200, restaurant, 'Total slots updated successfully'))
})

export { updateTotalSlots }
