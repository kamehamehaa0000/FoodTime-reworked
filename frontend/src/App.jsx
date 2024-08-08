import React, { useContext, useState } from 'react'
import Navbar from './components/Navbar'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProductDetails from './pages/ProductDetails'
import NotFound from './pages/404/NotFound'
import Checkout from './pages/Checkout'
import Success from './components/Success'
import globalContext from './contexts/globalContext'
import Dashboard from './pages/DashBoard'
const App = () => {
  const { token } = useContext(globalContext)

  return (
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
      >
        <div className="w-full min-h-screen overflow-x-hidden text-xl p-2 sm:p-10 pb-2  font-[gilroy]">
          <Navbar />{' '}
          {token ? (
            <>
              <Routes>
                <Route exact path="/" element={<LandingPage />} />
                <Route exact path="/success" element={<Success />} />
                <Route exact path="/home" element={<LandingPage />} />
                <Route exact path="/signup" element={<SignupPage />} />
                <Route exact path="/signin" element={<LoginPage />} />
                <Route exact path="/product" element={<ProductDetails />} />
                <Route exact path="/checkout" element={<Checkout />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="*" element={<NotFound />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route exact path="*" element={<LoginPage />} />
              <Route exact path="/signup" element={<SignupPage />} />
              <Route exact path="/signin" element={<LoginPage />} />
            </Routes>
          )}
        </div>{' '}
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}

export default App
