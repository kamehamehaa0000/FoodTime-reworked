import React, { useContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProductDetails from './pages/ProductDetails'
import NotFound from './pages/404/NotFound'
import Checkout from './pages/Checkout'
import Success from './components/Success'
import globalContext from './contexts/globalContext'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminNavbar from './components/AdminNavbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
const App = () => {
  const { token, adminToken } = useContext(globalContext)
  const [isAdminRoute, setIsAdminRoute] = useState('')
  const location = useLocation()
  useEffect(() => {
    setIsAdminRoute(location.pathname.startsWith('/admin'))
  }, [location])

  axios
    .get('https://your-backend.onrender.com/set-cookie', {
      withCredentials: true,
    })
    .then(() =>
      axios.get('https://your-backend.onrender.com/read-cookie', {
        withCredentials: true,
      })
    )
    .then((response) => console.log(response.data))

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
    >
      <div className="w-full min-h-screen overflow-x-hidden text-xl p-2 sm:p-10 pb-2  font-[gilroy]">
        {isAdminRoute ? <AdminNavbar /> : <Navbar />}
        <ToastContainer autoClose="1000" position="top-center" />
        {token ? (
          <>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route exact path="/success" element={<Success />} />
              <Route exact path="/home" element={<LandingPage />} />
              <Route exact path="/signup" element={<LandingPage />} />
              <Route exact path="/signin" element={<LandingPage />} />
              <Route
                exact
                path="/product/:productID"
                element={<ProductDetails />}
              />
              <Route exact path="/checkout" element={<Checkout />} />
              <Route exact path="/dashboard" element={<Dashboard />} />

              {adminToken ? (
                <>
                  <Route exact path="/admin/*" element={<AdminDashboard />} />
                  <Route
                    exact
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                  />
                </>
              ) : (
                <>
                  <Route
                    exact
                    path="/admin/dashboard"
                    element={<AdminLogin />}
                  />
                  <Route exact path="/admin/*" element={<AdminLogin />} />
                  <Route exact path="/admin/signin" element={<AdminLogin />} />
                </>
              )}
              <Route exact path="*" element={<NotFound />} />
            </Routes>
          </>
        ) : (
          <Routes>
            {adminToken ? (
              <>
                <Route exact path="/admin/*" element={<AdminDashboard />} />
                <Route
                  exact
                  path="/admin/dashboard"
                  element={<AdminDashboard />}
                />
              </>
            ) : (
              <>
                <Route exact path="/admin/dashboard" element={<AdminLogin />} />
                <Route exact path="/admin/*" element={<AdminLogin />} />
                <Route exact path="/admin/signin" element={<AdminLogin />} />
              </>
            )}
            <Route exact path="*" element={<LoginPage />} />
            <Route exact path="/admin" element={<AdminLogin />} />
            <Route exact path="/signup" element={<SignupPage />} />
            <Route exact path="/signin" element={<LoginPage />} />
          </Routes>
        )}
      </div>{' '}
    </GoogleOAuthProvider>
  )
}

export default App
