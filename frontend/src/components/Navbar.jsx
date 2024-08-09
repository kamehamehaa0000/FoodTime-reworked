import React, { useState, useEffect, useContext } from 'react'
import { BsCart2 } from 'react-icons/bs'
import { IoClose, IoLogOutOutline, IoPersonOutline } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import {
  RiDashboardHorizontalFill,
  RiDashboardHorizontalLine,
} from 'react-icons/ri'
import axios from 'axios'
import globalContext from '../contexts/globalContext'
import Cart from './Cart.jsx'
import { useQueryClient } from 'react-query'
const Navbar = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const debouncedSearch = useDebounce(search, 500)
  const [openChart, setOpenChart] = React.useState(false)
  const { token, setToken, loading } = useContext(globalContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  useEffect(() => {
    if (debouncedSearch) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/product/search?query=${debouncedSearch}`
          )
          setResults(response.data.data)
        } catch (error) {
          console.error('Error fetching search results', error)
        }
      }
      fetchData()
    } else {
      setResults([])
    }
  }, [debouncedSearch])

  console.log(results)

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      setToken(null)
      navigate('/signin')
    } catch (error) {
      alert('logout Failed')
    }
  }
  return (
    <div className="flex relative w-full items-center mb-5 justify-between px-4 bg-gray-100 h-16 rounded-2xl">
      <Link to={'/home'}>
        <div className="font-semibold flex items-center px-2 text-2xl">
          <span>FoodTime</span>
          <div className="h-[30px] mx-4 w-[1px] rounded-lg bg-gray-300"></div>
        </div>
      </Link>

      <div className="flex  flex-grow  items-center justify-center">
        <Search input={search} setInput={setSearch} />
      </div>

      <div className="flex text-lg mr-2">
        <button
          onClick={() => setOpenChart(!openChart)}
          className="mx-2 cursor-pointer text-green-500 flex items-center"
        >
          <BsCart2 className="mx-2 text-xl" />
          <h1 className="hidden sm:block">Cart </h1>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="mx-2 cursor-pointer text-green-500 flex items-center"
        >
          <RiDashboardHorizontalLine className="mx-2 text-xl" />
          <h1 className="hidden sm:block">Dashboard </h1>
        </button>
        {token ? (
          <button
            onClick={handleLogout}
            className="text-xl text-orange-500  flex items-center"
          >
            <IoLogOutOutline className="mx-2 text-xl" />

            <h1 className="hidden sm:block">Logout </h1>
          </button>
        ) : (
          <Link to="/signin ">
            <button className="text-xl text-orange-500  flex items-center">
              <IoPersonOutline className="mx-2 text-xl" />

              <h1 className="hidden sm:block">Login </h1>
            </button>{' '}
          </Link>
        )}
      </div>
      <CartOverlay openChart={openChart} setOpenChart={setOpenChart} />

      {search ? <Results results={results} /> : <></>}
    </div>
  )
}

export default Navbar

const Search = ({ input, setInput }) => {
  return (
    <div className=" w-full bg-white rounded-2xl">
      <div className="flex">
        <div className="flex flex-col w-full justify-center">
          <input
            type="text"
            className="w-full rounded-2xl bg-white pl-2 text-base text-gray-400 font-semibold outline-0"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center p-5  bg-[#9FE870] ">
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="pointer-events-none absolute w-5 fill-gray-500 transition"
          >
            <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}

const Results = ({ results }) => {
  return (
    <div className=" flex flex-col p-4  items-center  absolute rounded-xl overflow-y-auto z-[99] left-[50%] mx-auto -translate-x-1/2 top-[120%] w-11/12 sm:w-[80%]  h-60 bg-[#F6F7F8]">
      {results?.length > 0 ? (
        results?.map((result) => (
          <div
            key={result?._id}
            className="p-4 h-20  w-full justify-between items-center border-b   flex hover:bg-gray-100 cursor-pointer"
          >
            <div>
              <Link to={`/product/${result?._id}`}>
                <h3 className="text-lg font-semibold">{result?.name}</h3>
                <p className="text-sm text-gray-500">{result?.description}</p>
              </Link>
            </div>
            <div className="w-16 h-16  overflow-hidden">
              <img
                src={result?.imageUrl}
                className="w-16 h-16 rounded-full object-center object-cover"
                alt=""
              />
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No results found</div>
      )}
    </div>
  )
}
const CartOverlay = ({ openChart, setOpenChart }) => {
  function handleOverlayClick(event) {
    if (event.target == event.currentTarget) {
      setOpenChart(false)
    }
  }
  const queryClient = useQueryClient()
  queryClient.invalidateQueries(['cart'])
  return (
    <div
      onClick={handleOverlayClick}
      style={{ display: openChart ? 'block' : '' }}
      className="z-[99] hidden absolute  top-0 left-0 w-full h-full"
    >
      <div className="w-96 border bg-[#F6F7F8] absolute max-sm:left-0 max-sm:right-0 max-sm:mx-auto max-sm:top-[80px] max-sm:w-11/12 h-fit top-[70px] right-[30px] rounded-md">
        <div className="flex items-center justify-between pr-4">
          <h2 className="border-b p-4 w-fit text-base font-bold">Cart</h2>
          <button onClick={() => setOpenChart((prev) => !prev)}>
            <IoClose />
          </button>
        </div>
        <div className="p-2 sm:p-4">
          <Cart />
        </div>
      </div>
    </div>
  )
}

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
