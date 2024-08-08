import asyncHandler from '../utilities/AsyncHandler'
import ApiError from '../utilities/ErrorHandler'
import ApiResponse from '../utilities/ResponseHandler'
import { Request, Response } from 'express'
import { z } from 'zod'
import { Product } from '../models/product.model'
import { uploadToCloudinary } from '../utilities/cloudinaryUtils'
const LIMIT = 10
const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(0),
  category: z.string().min(3).max(50).default('All'),
  imageUrl: z.string(),
  offerPercentage: z.number(),
  inMenu: z.boolean().optional(),
})
// const getAllMenuItems = asyncHandler(async (req: Request, res: Response) => {
//   const menuItems = await Product.find({ inMenu: true })
//   if (!menuItems.length) {
//     throw new ApiError(404, 'No items found in the menu')
//   }
//   res
//     .status(200)
//     .json(new ApiResponse(200, menuItems, 'Menu items retrieved successfully'))
// })
const getMenuItemsPaginated = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 16, category } = req.query
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

    const filter: any = { inMenu: true }

    if (category && category !== 'all') {
      filter.category = category
    }

    const menuItems = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit as string))

    const total = await Product.countDocuments(filter)

    if (!menuItems.length) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            items: [],
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
          },
          'No items found'
        )
      )
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          items: menuItems,
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalItems: total,
        },
        'Menu items fetched successfully'
      )
    )
  }
)

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 16, category } = req.query
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

  const filter: any = {}
  if (category && category !== 'all') {
    filter.category = category
  }

  const products = await Product.find(filter)
    .skip(skip)
    .limit(parseInt(limit as string))

  const total = await Product.countDocuments(filter)

  if (!products.length) {
    return res.status(200).json(new ApiResponse(200, [], 'No Product Found'))
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalProducts: total,
      },
      'Products fetched successfully'
    )
  )
})
const changeInMenuStatus = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await Product.findById(productId)
  if (!product) {
    return res.status(200).json(new ApiResponse(200, [], 'No product Found'))
  }

  product.inMenu = !product.inMenu
  await product.save()

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        'Product inMenu status updated successfully'
      )
    )
})
const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Product.distinct('category')

  if (!categories || categories.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], 'No Categories Found'))
  }

  res
    .status(200)
    .json(new ApiResponse(200, categories, 'Categories fetched successfully'))
})

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find()
  if (!products) {
    throw new ApiError(404, 'No products found')
  }
  res
    .status(200)
    .json(new ApiResponse(200, products, 'Products fetched successfully'))
})

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await Product.findById(id)
  try {
    if (!id) {
      throw new ApiError(404, 'please provide id')
    }
    if (!product) {
      throw new ApiError(404, 'Product not found')
    }
    res
      .status(200)
      .json(new ApiResponse(200, product, 'Product fetched successfully'))
  } catch (error) {
    throw new ApiError(
      500,
      `Error creating product: ${(error as Error).message}`
    )
  }
})

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log('File received:', req.file)
    const file = (req.file as Express.Multer.File) || undefined
    if (!file) {
      throw new ApiError(400, 'Image file is required')
    }
    const imageLocalPath = file.path
    const imageUrl = (await uploadToCloudinary(imageLocalPath))?.url
    if (!imageUrl) {
      throw new ApiError(500, 'Image upload failed')
    }
    const { name, description, price, category, offerPercentage } = req.body
    const productData = {
      name,
      description,
      price: parseInt(price),
      category,
      offerPercentage: parseInt(offerPercentage),
      imageUrl,
    }
    const { success, error } = productSchema.safeParse(productData)
    if (!success) {
      throw new ApiError(400, `Invalid Inputs: ${error.message}`)
    }

    const product = await Product.create(productData)

    return res
      .status(201)
      .json(new ApiResponse(201, product, 'Product created successfully'))
  } catch (error) {
    throw new ApiError(
      500,
      `Error creating product: ${(error as Error).message}`
    )
  }
})

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params
  const file = (req.file as Express.Multer.File) || undefined

  let imageUrl: string | undefined
  if (file) {
    const imageLocalPath = file.path
    imageUrl = (await uploadToCloudinary(imageLocalPath))?.url
    if (!imageUrl) {
      throw new ApiError(500, 'Image upload failed')
    }
  }
  console.log(req.body)
  const productData = imageUrl ? { ...req.body, imageUrl } : req.body
  console.log(productData)
  const { success, error } = productSchema.partial().safeParse(productData)
  if (!success) {
    throw new ApiError(400, `Invalid Inputs: ${error.message}`)
  }

  const product = await Product.findByIdAndUpdate(productId, productData, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'))
})

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params

  const product = await Product.findByIdAndDelete(productId)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Product deleted successfully'))
})

const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query
  if (!query || typeof query !== 'string') {
    throw new ApiError(400, 'Query parameter is required and must be a string')
  }

  const searchTerm = query.trim()
  const products = await Product.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
    ],
  })

  if (products.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], 'No products found'))
  }

  res
    .status(200)
    .json(new ApiResponse(200, products, 'Products fetched successfully'))
})

export {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  searchProducts,
  getProducts,
  getAllCategories,
  getMenuItemsPaginated,
  changeInMenuStatus,
}
