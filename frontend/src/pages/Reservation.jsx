import React, { useState } from 'react'
import { useAddReservation } from '../hooks/useReservation'
import res from '../assets/res.png'

const Reservation = () => {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [heads, setHeads] = useState('')
  const { mutate: addReservation, isLoading, error } = useAddReservation()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!time || !date || !phoneNumber || !heads) {
      alert('Please fill in all fields')
      return
    }

    const reservationData = {
      time,
      date,
      phoneNumber: parseInt(phoneNumber),
      heads,
    }

    addReservation(reservationData, {
      onSuccess: () => {
        setTime('')
        setDate('')
        setPhoneNumber('')
        setHeads('')
        alert('Reservation made successfully')
      },
      onError: (error) => {
        alert(
          `Error: ${error.response?.data?.message || 'Something went wrong'}`
        )
      },
    })
  }

  return (
    <div className="mx-auto w-full lg:w-8/12 md:max-h-[60vh] mb-10 rounded-3xl overflow-hidden flex-col sm:flex-row flex">
      <div className="w-full md:w-1/2">
        <img
          src={res}
          alt="Reservation"
          className="w-full h-full object-cover"
        />
      </div>
      <div className=" w-full md:w-1/2 p-6 ">
        <h2 className="text-2xl font-bold mb-4">Make a Reservation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="time"
              className="text-base font-semibold text-gray-700"
            >
              Time
            </label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Enter time of Reservation"
              className="border-2 rounded-lg text-black text-base px-2 py-1 w-full font-medium"
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="text-base font-semibold text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              placeholder="Enter Date of Reservation"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-2 rounded-lg text-black text-base px-2 py-1 w-full font-medium"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="text-base font-semibold text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter your Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-2 rounded-lg text-black text-base px-2 py-1 w-full font-medium"
              required
            />
          </div>
          <div>
            <label
              htmlFor="heads"
              className="text-base font-semibold text-gray-700"
            >
              Number of Heads
            </label>
            <input
              type="text"
              id="heads"
              value={heads}
              placeholder="Enter no. of people Eating"
              onChange={(e) => setHeads(e.target.value)}
              className="border-2 rounded-lg text-black text-base px-2 py-1 w-full font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 text-white py-2 px-4 rounded-md shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'Submitting...' : 'Reserve Now'}
          </button>
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  )
}

export default Reservation
