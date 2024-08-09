import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import globalContext from '../../contexts/globalContext'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAdminToken } = useContext(globalContext)
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      setAdminToken(response.data.data.token)
      setLoading(false)
      navigate('/admin/dashboard')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" flex items-center justify-center py-20 rounded-2xl">
      <div className="  rounded-lg overflow-hidden w-full max-w-md">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Admin Login
          </h2>
          <p className="text-gray-600 text-center mt-2">Welcome back! Admin</p>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded mt-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6">
            <div className="mt-4">
              <label className="block text-gray-700  text-lg font-bold mb-2">
                Username
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded-lg py-1 px-4 block w-full focus:outline-none "
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Password
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded-lg py-1 px-4 block w-full focus:outline-none "
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <a
                href="#"
                className="text-xs text-blue-500 hover:text-blue-700 text-end w-full mt-2 block"
              >
                Forgot Password?
              </a>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-zinc-900 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
