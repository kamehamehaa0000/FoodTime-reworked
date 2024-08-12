import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'

const Checkout = () => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [address, setAddress] = useState({
    pinCode: '',
    city: '',
    state: '',
    address: '',
  })
  const [phoneNumber, setPhoneNumber] = useState('')
  const handleCreateOrder = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/order/create`,
        { address, phoneNumber },
        { withCredentials: true }
      )
      if (data.data && data.data.razorpayOrderId) {
        openRazorpayCheckout(data.data)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const openRazorpayCheckout = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Medishop',
      description: 'Payment for order.',
      order_id: orderData.razorpayOrderId,
      handler: function (response) {
        handlePaymentSuccess(response, orderData.order._id)
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Customer Address',
      },
      theme: {
        color: '#9FE870',
      },
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } else {
      console.error('Razorpay SDK not loaded.')
    }
  }

  const handlePaymentSuccess = async (response, orderId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/order/complete`,
        {
          orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        },
        {
          withCredentials: true,
        }
      )
      queryClient.invalidateQueries(['cart'])
      navigate('/success')
    } catch (error) {
      alert('Error Completing order')
    }
  }

  return (
    <div>
      <div>
        <AddressForm
          address={address}
          setAddress={setAddress}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      </div>
      <button
        className="px-2 mt-2  py-2 text-sm font-semibold bg-green-500 rounded-lg text-white"
        onClick={handleCreateOrder}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Pay with Razorpay'}
      </button>
    </div>
  )
}

export default Checkout
const AddressForm = ({ address, setAddress, phoneNumber, setPhoneNumber }) => {
  return (
    <div className="text-base w-full p-4 flex flex-col gap-2 max-w-lg bg-gray-100 rounded-xl">
      <div>
        <label className="font-semibold text-lg" htmlFor="PhoneNumber">
          Phone Number{' '}
        </label>
        <input
          id="PhoneNumber"
          type="text"
          name="PhoneNumber"
          value={phoneNumber}
          required
          onChange={(e) => {
            setPhoneNumber(e.target.value)
          }}
          placeholder="Enter your Phone Number"
          className="px-2 w-full py-1 rounded-md bg-zinc-800 text-gray-200"
        />
      </div>
      <div>
        <label className="font-semibold text-lg" htmlFor="address">
          Delivery Address{' '}
        </label>
        <input
          id="address"
          type="text"
          name="address"
          value={address.address}
          required
          onChange={(e) => {
            setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }}
          placeholder="Enter your Address"
          className="px-2 w-full py-1 rounded-md bg-zinc-800 text-gray-200"
        />
      </div>
      <div className="gap-2 items-center justify-between">
        <label className="font-semibold text-lg" htmlFor="city">
          City{' '}
        </label>
        <input
          id="city"
          type="text"
          name="city"
          required
          value={address.city}
          onChange={(e) => {
            setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }}
          placeholder="Enter your City"
          className="px-2 w-full py-1 rounded-md bg-zinc-800 text-gray-200"
        />
      </div>
      <div>
        <label className="font-semibold text-lg" htmlFor="state">
          State{' '}
        </label>
        <input
          id="state"
          type="text"
          required
          name="state"
          value={address.state}
          onChange={(e) => {
            setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }}
          placeholder="Enter your State"
          className="px-2 py-1 w-full rounded-md bg-zinc-800 text-gray-200"
        />
      </div>
      <div className="w-full flex items-center my-4 gap-4">
        <label className="font-semibold text-lg" htmlFor="pincode">
          Pincode{' '}
        </label>
        <input
          id="pincode"
          required
          type="text"
          name="pinCode"
          value={address.pinCode}
          onChange={(e) => {
            setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }}
          placeholder="Enter your Pincode"
          className="px-2 py-1 rounded-md bg-zinc-800 text-gray-200"
        />
      </div>
    </div>
  )
}
