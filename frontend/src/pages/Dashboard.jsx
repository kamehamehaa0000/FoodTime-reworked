import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MdEdit } from 'react-icons/md'
import Loader from '../components/shared/Loader'
import { useUserReservations } from '../hooks/useReservation'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState('')
  let element = ''
  switch (currentTab) {
    case 'user': {
      element = <ShowUser />
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
    default: {
      element = <div>Please select a tab</div>
    }
  }

  return (
    <div className="w-full  bg-gray-100 rounded-3xl p-4">
      <h1 className="font-semibold text-2xl my-3">Dashboard</h1>
      <div className="w-full rounded-xl bg-white p-2 text-lg font-medium gap-2 flex-wrap flex">
        <ButtonDash
          name={'User Details'}
          tab="user"
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
      } rounded-full text-base px-4 py-2`}
    >
      {name}
    </button>
  )
}

const ShowOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/order/userorders`,
          {
            withCredentials: true,
          }
        )
        console.log(response.data.data)
        setOrders(response.data.data)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        toast.error(`No orders found `, {
          autoClose: 1000,
        })
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="w-full  py-6 px-4">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-base font-semibold mb-4">
              Order ID: {order._id}
            </h3>
            <div className="mb-4 text-base">
              <h4 className="text-lg font-medium mb-2">Items:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 font-medium">Product</th>
                      <th className="py-2 px-4 font-medium">Quantity</th>
                      <th className="py-2 px-4 font-medium">
                        Price (per unit)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.items?.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-2 px-4">{item?.product?.name}</td>
                        <td className="py-2 px-4">{item?.quantity}</td>
                        <td className="py-2 px-4">
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

            <div className="mt-4">
              <h4 className="text-lg font-medium">
                Total Amount:{' '}
                <span className="font-semibold text-green-600">
                  Rs. {order.totalPrice.toFixed(2)}
                </span>
              </h4>
              <h4 className="text-lg font-medium">
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

const ShowUser = () => {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    avatar: null,
  })

  const ApiURL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${ApiURL}/user/getuser`, {
          withCredentials: true,
        })
        setUser(response.data.data)
        setEditedUser({
          username: response.data.data.username,
          email: response.data.data.email,
          avatar: response.data.data.avatar,
        })
        setIsLoading(false)
      } catch (error) {
        alert('Error fetching the user')
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [ApiURL])

  const handleSaveClick = async () => {
    try {
      const formData = new FormData()
      formData.append('username', editedUser.username)
      formData.append('email', editedUser.email)
      if (editedUser.avatar) {
        formData.append('avatar', editedUser.avatar)
      }
      setIsLoading(true)
      const response = await axios.put(`${ApiURL}/user/update`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUser(response.data.data)
      setIsEditing(false)
      setIsLoading(false)
    } catch (error) {
      alert('Error updating the user')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="w-full sm:max-w-lg px-4 py-6 mx-auto sm:mx-0">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      <div className="bg-white my-4 font-semibold p-6 rounded-lg shadow-lg">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <input
              type="file"
              onChange={(e) =>
                setEditedUser({ ...editedUser, avatar: e.target.files[0] })
              }
              className="mb-4 dark:bg-zinc-800 rounded-lg file:bg-zinc-700 file:rounded-lg file:border-0 file:text-sm file:p-2 file:text-white text-base dark:text-white"
            />
            <input
              type="text"
              name="username"
              placeholder="Enter new Username"
              value={editedUser.username}
              onChange={(e) =>
                setEditedUser({
                  ...editedUser,
                  [e.target.name]: e.target.value,
                })
              }
              className="border dark:bg-white text-black  text-base rounded-lg p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter new Email"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({
                  ...editedUser,
                  [e.target.name]: e.target.value,
                })
              }
              className="border text-base rounded-lg p-2"
            />
            <div className="w-full flex justify-between gap-5 items-center">
              <button
                onClick={handleSaveClick}
                className="bg-green-500 w-full  text-white text-base rounded-lg p-2"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  setIsEditing(false)
                  setEditedUser({
                    username: '',
                    email: '',
                    avatar: null,
                  })
                }}
                className=" w-full bg-red-500 text-white text-base rounded-lg p-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex  text-left font-medium flex-col rounded-3xl gap-4">
            <img
              className="rounded-full object-center object-cover w-32 h-32 mx-auto"
              src={user.avatar || '/default-avatar.png'}
              alt="User Avatar"
            />
            <h1 className="">
              Name:{' '}
              <span className="text-base font-medium  p-2 ">
                {user.firstName} {user.lastName}
              </span>
            </h1>
            <h1>
              Email:{' '}
              <span className="text-base font-medium  p-2 ">{user.email}</span>{' '}
            </h1>
            <h1>
              Username:{' '}
              <span className="text-base font-medium  p-2 ">
                {user.username}
              </span>
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-zinc-800 flex items-center justify-center gap-3  text-white rounded-lg p-2"
            >
              <MdEdit className="inline text-2xl" />
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const ShowReservations = () => {
  const { data: reservations, isLoading, error } = useUserReservations()
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
      <h2 className="text-2xl font-bold mb-6">Your Reservations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reservations?.data.map((reservation, idx) => (
          <div
            key={reservation._id}
            className="bg-white shadow-lg rounded-lg text-sm p-4 my-2 flex flex-col  border border-gray-200"
          >
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
