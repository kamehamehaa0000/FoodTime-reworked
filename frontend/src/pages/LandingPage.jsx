import React from 'react'
import Hero from '../components/Hero'
import Products from '../components/Products'
import Footer from '../components/Footer'
import Page3 from './Page3'
import HorizontalCarousel from '../components/HorizontalCarousel'
import Reservation from './Reservation'

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <Products />
      <Page3 />
      <Reservation />
      <Footer />
    </div>
  )
}

export default LandingPage
