import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const globalContext = createContext()

export const GlobalProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [adminToken, setAdminToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/check-auth`,
          { withCredentials: true }
        )
        if (response.data.token) {
          setToken(response.data.token)
        } else {
          setToken(null) // Clear token if invalid
        }
      } catch (error) {
        setToken(null) // Clear token on error
      } finally {
        setLoading(false)
      }
    }

    const checkAuthStatusAdmin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/check-auth`,
          { withCredentials: true }
        )
        if (response.data.adminToken) {
          setAdminToken(response.data.adminToken)
        } else {
          setAdminToken(null) // Clear adminToken if invalid
        }
      } catch (error) {
        setAdminToken(null) // Clear adminToken on error
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
    checkAuthStatusAdmin()
  }, [])

  return (
    <globalContext.Provider
      value={{ token, adminToken, setAdminToken, setToken, loading }}
    >
      {children}
    </globalContext.Provider>
  )
}

export default globalContext
