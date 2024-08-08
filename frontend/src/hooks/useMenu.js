import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchMenuItems = async (page, category) => {
  const { data } = await axios.get(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/menu/filter?category=${category}&page=${page}`,
    {
      withCredentials: true,
    }
  )
  return data
}

const updateMenuStatus = async ({ productId, inMenu }) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/product/menu/status/${productId}`,
    {},
    {
      withCredentials: true,
    }
  )
  return data
}

export const useMenuItems = (page, category) => {
  return useQuery(['menuItems', page, category], () =>
    fetchMenuItems(page, category)
  )
}

export const useUpdateMenuStatus = () => {
  const queryClient = useQueryClient()

  return useMutation(updateMenuStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('menuItems')
    },
  })
}
