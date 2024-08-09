import { Request, Response } from 'express'
import Staff, { IStaff } from '../models/staff.model'
import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'

import { z } from 'zod'

const staffSchema = z.object({
  name: z.string(),
  role: z.string(),
  phoneNumber: z.number(),
  shift: z.string().optional(),
  dateOfJoining: z.string(),
})

export const addStaffMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, role, phoneNumber, shift, dateOfJoining } = staffSchema.parse(
      req.body
    )

    const staffMember = new Staff({
      name,
      role,
      phoneNumber,
      shift,
      dateOfJoining,
    })

    const savedStaffMember = await staffMember.save()
    if (!savedStaffMember) {
      throw new ApiError(500, 'Failed to add staff member')
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          savedStaffMember,
          'Staff member added successfully'
        )
      )
  }
)

// Delete a staff member
export const deleteStaffMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { staffId } = req.params

    const deletedStaffMember = await Staff.findByIdAndDelete(staffId)
    if (!deletedStaffMember) {
      throw new ApiError(404, 'Staff member not found')
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedStaffMember,
          'Staff member deleted successfully'
        )
      )
  }
)

// Update a staff member
export const updateStaffMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { staffId } = req.params
    const { _id: staffID } = req.body
    console.log(staffID, staffId)
    const updatedFields: Partial<IStaff> = {}
    const { phoneNumber, shift, name, dateOfJoining } = staffSchema
      .partial()
      .parse(req.body)

    if (phoneNumber) updatedFields.phoneNumber = phoneNumber
    if (shift) updatedFields.shift = shift
    if (name) updatedFields.name = name
    if (dateOfJoining) updatedFields.dateOfJoining = dateOfJoining

    const updatedStaffMember = await Staff.findByIdAndUpdate(
      staffId || staffID,
      updatedFields,
      { new: true }
    )
    if (!updatedStaffMember) {
      throw new ApiError(404, 'Staff member not found')
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedStaffMember,
          'Staff member updated successfully'
        )
      )
  }
)

// Get all staff members
export const getAllStaffMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const allStaffMembers = await Staff.find({})
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allStaffMembers,
          'All staff members retrieved successfully'
        )
      )
  }
)
