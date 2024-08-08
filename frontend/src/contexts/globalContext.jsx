// globalContext.js
import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const globalContext = createContext()

export const GlobalProvider = ({ children }) => {
  const [token, setToken] = useState(null)
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
        }
      } catch (error) {
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  return (
    <globalContext.Provider value={{ token, setToken, loading }}>
      {children}
    </globalContext.Provider>
  )
}

export default globalContext
