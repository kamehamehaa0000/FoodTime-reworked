import { useMutation, useQuery } from 'react-query'
import axios from 'axios'

const createOrder = async () => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/order/create`,
    {
      withCredentials: true,
    }
  )
  return data
}

const completeOrder = async (orderId, paymentIntentId) => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/order/complete`,
    { orderId, paymentIntentId },
    {
      withCredentials: true,
    }
  )
}

const fetchOrder = async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/order/orderbyid/${id}`,
    {
      withCredentials: true,
    }
  )
  return data
}
const fetchAdminOrder = async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/order/allorders`,
    {
      withCredentials: true,
    }
  )
  return data
}

export const useCreateOrder = () => {
  return useMutation(() => createOrder())
}

export const useCompleteOrder = () => {
  return useMutation((orderId, paymentIntentId) =>
    completeOrder(orderId, paymentIntentId)
  )
}

export const useOrder = (id) => {
  return useQuery(['order', id], () => fetchOrder(id))
}
export const useAllOrder = (id) => {
  return useQuery(['order', id], () => fetchAdminOrder())
}
