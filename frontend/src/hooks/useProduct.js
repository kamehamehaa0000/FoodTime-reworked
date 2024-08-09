import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

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

const changeInMenuStatus = async (productId) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/product/menu/status/${productId}`,
    {},
    {
      withCredentials: true,
    }
  )
  return data
}
const fetchAllMenuItems = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/product/menu/all`,
    {
      withCredentials: true,
    }
  )
  return data
}

const fetchCategories = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/product/categories`
  )
  return data
}
const deleteProduct = async (productId) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/product/delete/${productId}`,
    {
      withCredentials: true,
    }
  )
  return data
}
const updateProduct = async (productId, productData) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/product/update/${productId}`,
    productData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }
  )
  return data
}
const createProduct = async (productData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/product/create`,
    productData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }
  )
  return data
}
const fetchProductById = async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/product/${id}`,
    {
      withCredentials: true,
    }
  )
  return data
}

export const useProductById = (id) => {
  return useQuery(['productById', id], () => fetchProductById(id), {
    enabled: !!id,
  })
}
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(createProduct, {
    onSuccess: () => {
      return queryClient.invalidateQueries('products')
    },
  })
}
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (productId, productData) => updateProduct(productId, productData),
    {
      onSuccess: () => {
        return queryClient.invalidateQueries('products')
      },
    }
  )
}
export const useAllMenuItems = () => {
  return useQuery('allMenuItems', fetchAllMenuItems)
}
export const useChangeInMenuStatus = () => {
  const queryClient = useQueryClient()
  return useMutation(changeInMenuStatus, {
    onSuccess: () => {
      return queryClient.invalidateQueries('products')
    },
  })
}
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(deleteProduct, {
    onSuccess: () => {
      return queryClient.invalidateQueries('products')
    },
  })
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
