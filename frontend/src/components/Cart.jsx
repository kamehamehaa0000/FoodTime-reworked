import React from 'react'
import { useAddToCart, useCart, useRemoveFromCart } from '../hooks/useCart'
import Loader from './shared/Loader'
import { IoIosAdd, IoIosRemove } from 'react-icons/io'
import Checkout from '../pages/Checkout'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const { data: cart, isLoading, isError } = useCart()
  const { mutate: removeFromCart } = useRemoveFromCart()
  const { mutate: addToCart } = useAddToCart()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  if (isLoading) {
    return (
      <div className="w-full p-4">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return <div className="w-full p-4 text-center">Your Cart is empty.</div>
  }

  let total = 0

  return (
    <div className="w-full bg-[#F6F7F8] ">
      {cart?.data && cart?.data?.items?.length > 0 ? (
        <table className="xl:max-w-xl w-full bg-white text-sm rounded-xl">
          <thead>
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.data.items.map((item) => {
              const discountedPrice =
                item.product.price -
                (item.product.offerPercentage / 100) * item.product.price
              total += discountedPrice * item.quantity

              return (
                <tr key={item.product._id}>
                  <td className="p-2 text-left">{item.product.name}</td>
                  <td className="p-2 text-center">Rs.{discountedPrice}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 flex items-center gap-2">
                    <button
                      className="bg-green-500 px-2 py-1 rounded-xl text-white"
                      onClick={() => {
                        addToCart(item.product._id)
                      }}
                    >
                      <IoIosAdd />
                    </button>
                    <button
                      className="bg-red-500 px-2 py-1 rounded-xl text-white"
                      onClick={() => {
                        removeFromCart(item.product._id)
                      }}
                    >
                      <IoIosRemove />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <p>No items in cart</p>
      )}

      {total ? (
        <div className="flex mt-4 items-center w-full justify-between">
          <button
            onClick={() => navigate('/checkout')}
            className="bg-blue-500 text-base font-semibold py-1 px-2 text-white rounded-lg"
          >
            Checkout
          </button>
          <h1 className="text-base my-2 w-fit font-semibold">
            Total Price - Rs. {total}
          </h1>
        </div>
      ) : null}
    </div>
  )
}

export default Cart
