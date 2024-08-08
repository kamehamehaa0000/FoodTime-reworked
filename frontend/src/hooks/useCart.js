import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchCart = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/cart/getcart`,
    {
      withCredentials: true,
    }
  )
  return data
}

const addToCart = async (productId, quantity) => {
  quantity = parseInt(quantity)
  return await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
    { productId, quantity },
    {
      withCredentials: true,
    }
  )
}

const removeFromCart = async (productId) => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/cart/remove`,
    { productId },
    {
      withCredentials: true,
    }
  )
}

export const useCart = () => {
  return useQuery(['cart'], fetchCart, {
    staleTime: 1000 * 60, //1min
    cacheTime: 1000 * 30, //30sec
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  return useMutation((productId, quantity) => addToCart(productId, quantity), {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  return useMutation((productId) => removeFromCart(productId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
    },
  })
}
