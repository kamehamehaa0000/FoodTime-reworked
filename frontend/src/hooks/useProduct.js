import { useQuery } from 'react-query'
import axios from 'axios'

// Fetch all products
const fetchProducts = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/product/products`,
    {
      withCredentials: true,
    }
  )

  return data
}

const fetchProductsByCategory = async (category, page) => {
  const { data } = await axios.get(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/product/products/filter?category=${category}&page=${page}`,
    {
      withCredentials: true,
    }
  )

  return data
}

// Fetch all categories
const fetchCategories = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/product/categories`
  )
  return data
}

export const useProduct = (page, category) => {
  return useQuery(['products', page, category], () =>
    fetchProducts(page, category)
  )
}

export const useProductsByCategory = (category, page) => {
  return useQuery(['productsByCategory', category, page], () =>
    fetchProductsByCategory(category, page)
  )
}

export const useCategories = () => {
  return useQuery(['categories'], fetchCategories)
}
