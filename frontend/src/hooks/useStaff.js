import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchAllStaff = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/staff/getall`,
    {
      withCredentials: true,
    }
  )
  return data
}

const addStaffMember = async (staffData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/staff/add`,
    staffData,
    {
      withCredentials: true,
    }
  )
  return data
}

const updateStaffMember = async ({ staffId, updatedData }) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/staff/update/${staffId}`,
    updatedData,
    {
      withCredentials: true,
    }
  )
  return data
}

const deleteStaffMember = async (staffId) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/staff/delete/${staffId}`,
    {
      withCredentials: true,
    }
  )
  return data
}

export const useAllStaff = () => {
  return useQuery('allStaff', fetchAllStaff)
}

export const useAddStaff = () => {
  const queryClient = useQueryClient()
  return useMutation(addStaffMember, {
    onSuccess: () => {
      queryClient.invalidateQueries('allStaff')
    },
  })
}

export const useUpdateStaff = () => {
  const queryClient = useQueryClient()
  return useMutation(updateStaffMember, {
    onSuccess: () => {
      queryClient.invalidateQueries('allStaff')
    },
  })
}

export const useDeleteStaff = () => {
  const queryClient = useQueryClient()
  return useMutation(deleteStaffMember, {
    onSuccess: () => {
      queryClient.invalidateQueries('allStaff')
    },
  })
}
