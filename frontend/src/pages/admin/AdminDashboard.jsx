import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MdEdit } from 'react-icons/md'
import Loader from '../../components/shared/Loader'
import {
  useAllReservations,
  useUserReservations,
} from '../../hooks/useReservation'
import ShowStaff from '../../components/Admin/ShowStaff'
import { useAllOrder } from '../../hooks/useOrder'
import ShowProducts from '../../components/Admin/ShowProduct'
import { useAllMenuItems } from '../../hooks/useProduct'
import { IoIosAdd } from 'react-icons/io'
import { IoIosRemove } from 'react-icons/io'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState('')
  let element = ''
  switch (currentTab) {
    case 'admin': {
      element = <ShowAdmin />
      break
    }
    case 'orders': {
      element = <ShowOrders />
      break
    }
    case 'reservation': {
      element = <ShowReservations />
      break
    }
    case 'products': {
      element = <ShowProducts />
      break
    }
    case 'staff': {
      element = <ShowStaff />
      break
    }
    case 'menu': {
      element = <ShowMenu />
      break
    }

    default: {
      element = <div>Please select a tab</div>
    }
  }

  return (
    <div className="w-full  bg-gray-100 rounded-3xl p-4">
      <h1 className="font-semibold text-2xl my-3">Admin Dashboard</h1>
      <div className="w-full rounded-xl bg-white p-2 text-lg font-medium gap-2 flex-wrap flex">
        <ButtonDash
          name={'Admin Profile'}
          tab="admin"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <ButtonDash
          name={'Order History'}
          tab="orders"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <ButtonDash
          name={'Reservations'}
          tab="reservation"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <ButtonDash
          name={'Products'}
          tab="products"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <ButtonDash
          name={'Staff'}
          tab="staff"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <ButtonDash
          name={'Menu'}
          tab="menu"
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
      <div>{element}</div>
    </div>
  )
}
export default Dashboard
const ButtonDash = ({ name, tab, currentTab, setCurrentTab }) => {
  return (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`${
        currentTab === tab ? 'bg-zinc-800 text-white' : 'bg-gray-100'
      } rounded-full text-base px-4 py-1`}
    >
      {name}
    </button>
  )
}

const ShowOrders = () => {
  const { data: orders, isLoading, error } = useAllOrder()
  console.log(orders)
  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="w-full text-sm py-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="bg-white p-2 rounded-lg shadow-lg">
        {orders?.data?.map((order, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-sm font-semibold my-2">
              Order ID: {order._id}
            </h3>
            <h3 className="text-base font-semibold mb-4">
              Phone No. : {order?.phoneNumber || ''}
            </h3>
            <h3 className="text-sm font-semibold mb-4">
              Address:{' '}
              {`${order?.address?.address}, ${order?.address?.city}, ${order?.address?.state}, ${order?.address?.pincode}` ||
                ''}
            </h3>
            <div className="my-2 *:text-base">
              <h4 className="text-base font-medium my-2">Items:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-2 font-medium">Product</th>
                      <th className="py-2 px-2 font-medium">Quantity</th>
                      <th className="py-2 px-2 font-medium">
                        Price (per unit)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b text-sm border-gray-200"
                      >
                        <td className="py-2 px-2">{item.product.name}</td>
                        <td className="py-2 px-2">{item.quantity}</td>
                        <td className="py-2 px-2">
                          Rs.{' '}
                          {(
                            item.product.price -
                            (item.product.offerPercentage / 100) *
                              item.product.price
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-base font-medium">
                Total Amount:{' '}
                <span className="font-semibold text-green-600">
                  Rs. {order.totalPrice.toFixed(2)}
                </span>
              </h4>
              <h4 className="text-sm font-medium">
                Payment Status:{' '}
                <span
                  className={`font-medium ${
                    order.status === 'Completed'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {order.status}
                </span>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShowReservations = () => {
  const { data: reservations, isLoading, error } = useAllReservations()
  if (isLoading) {
    return <Loader />
  }
  if (error) {
    return (
      <p className="text-red-500">
        Failed to load reservations. Please try again later.
      </p>
    )
  }
  if (!reservations?.data || reservations?.data?.length === 0) {
    return <p className="text-gray-500">No reservations found.</p>
  }
  return (
    <div className="container  px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Reservations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reservations?.data.map((reservation) => (
          <div className="bg-white shadow-lg rounded-lg text-sm p-4 my-2 flex flex-col  border border-gray-200">
            <p className="text-gray-700 text-sm">
              <strong>Reservation Id:</strong> {reservation._id}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong> {reservation.date}
            </p>
            <p className="text-gray-700">
              <strong>Time:</strong> {reservation.time}
            </p>
            <p className="text-gray-700">
              <strong>Phone Number:</strong> {reservation.phoneNumber}
            </p>
            <p className="text-gray-700">
              <strong>Heads:</strong> {reservation.heads}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
const ShowMenu = () => {
  const { data: menuItems, isLoading, error } = useAllMenuItems()
  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <p className="text-red-500">
        Failed to load menuItems. Please try again later.
      </p>
    )
  }
  if (!menuItems?.data || menuItems?.data?.length === 0) {
    return <p className="text-gray-500">No menuItems found.</p>
  }
  const queryClient = useQueryClient()
  const handleChangeInMenuStatus = async (productId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/product/menu/status/${productId}`,
        {},
        {
          withCredentials: true,
        }
      )
      queryClient.invalidateQueries('allMenuItems')
    } catch (error) {
      console.error('Error changing menu status:', error)
    }
  }
  return (
    <div className="container  px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">menuItems</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems?.data.map((item) => (
          <div className=" relative bg-white shadow-lg rounded-lg text-sm p-4 my-2 flex flex-col  border border-gray-200">
            <p className="text-gray-700 text-sm">
              <strong>Item Id:</strong> {item._id}
            </p>
            <p className="text-gray-700">
              <strong>Name:</strong> {item.name}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {item.description}
            </p>
            <p className="text-gray-700">
              <strong>Price:</strong> {item.price}
            </p>
            <p className="text-gray-700">
              <strong>Offer </strong> {item.offerPercentage}
            </p>
            <p className="text-gray-700">
              <img
                src={item.imageUrl}
                className="object-center object-contain w-full h-32"
                alt=""
              />
            </p>
            <div>
              <button
                onClick={() => handleChangeInMenuStatus(item._id)}
                className={`absolute bottom-0 right-0 m-3 rounded-lg px-2 py-1  text-xl  ${
                  item.inMenu ? 'bg-zinc-800' : 'bg-blue-600'
                } text-white hover:${
                  item.inMenu ? 'bg-zinc-800' : 'bg-blue-600'
                }`}
              >
                {item.inMenu ? <IoIosRemove /> : <IoIosAdd />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShowAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const mutation = useMutation(
    async (newData) => {
      return axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update`,
        newData,
        {
          withCredentials: true,
        }
      )
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message || 'Admin updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update admin')
      },
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="max-w-lg px-4 py-6 my-6 rounded-md">
      <h2 className="text-2xl font-bold mb-4 ">Update Admin</h2>
      <form className="text-base" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className=" text-base font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 px-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter new username"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-base font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 px-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter new password"
          />
        </div>
        <button
          type="submit"
          className=" bg-zinc-900 font-semibold text-white px-2 py-1 w-fit rounded-md hover:bg-white hover:text-black transition duration-300"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Updating...' : 'Update Admin'}
        </button>
      </form>
    </div>
  )
}
