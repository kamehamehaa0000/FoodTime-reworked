import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchUserReservations = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/reservation/user`,
    {
      withCredentials: true,
    }
  )
  return data
}

const fetchAllReservations = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/reservation/getall`,
    {
      withCredentials: true,
    }
  )
  return data
}

const addReservation = async (reservation) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/reservation/add`,
    reservation,
    {
      withCredentials: true,
    }
  )
  return data
}

const deleteReservation = async (resID) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/reservation/delete/${resID}`,
    {
      withCredentials: true,
    }
  )
  return data
}

export const useUserReservations = () => {
  return useQuery('userReservations', fetchUserReservations)
}

export const useAllReservations = () => {
  return useQuery('allReservations', fetchAllReservations)
}

export const useAddReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addReservation,
    onSuccess: () => {
      queryClient.invalidateQueries('userReservations')
      queryClient.invalidateQueries('allReservations')
    },
  })
}

export const useDeleteReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries('userReservations')
      queryClient.invalidateQueries('allReservations')
    },
  })
}
