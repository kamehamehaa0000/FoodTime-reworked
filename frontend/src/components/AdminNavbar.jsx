import React, { useState, useEffect, useContext } from 'react'
import { BsCart2 } from 'react-icons/bs'
import { IoLogOutOutline, IoPersonOutline } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { RiDashboardHorizontalLine } from 'react-icons/ri'
import axios from 'axios'
import globalContext from '../contexts/globalContext'

import { useQueryClient } from 'react-query'
const AdminNavbar = () => {
  const [openChart, setOpenChart] = React.useState(false)
  const { adminToken, setAdminToken, loading } = useContext(globalContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      setAdminToken(null)
      navigate('/admin')
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

      <div className="flex text-lg mr-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="mx-2 cursor-pointer text-green-500 flex items-center"
        >
          <RiDashboardHorizontalLine className="mx-2 text-xl" />
          <h1 className="hidden sm:block">Dashboard </h1>
        </button>
        {adminToken ? (
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
    </div>
  )
}

export default AdminNavbar
