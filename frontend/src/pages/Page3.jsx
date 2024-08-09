import React from 'react'
import ser1 from '../assets/ser1.png'
import ser2 from '../assets/ser2.png'
import ser3 from '../assets/ser3.png'
import dalmakh from '../assets/dalmakh.png'
import HorizontalCarousel from '../components/HorizontalCarousel'

const Page3 = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="text-center text-3xl sm:text-4xl font-bold my-4 sm:my-6">
        Our Specialty
      </div>
      <div className="w-full">
        <HorizontalCarousel />
      </div>
      <div
        id="services"
        className="text-center text-3xl sm:text-4xl font-bold my-4 sm:my-6"
      >
        Reservations
      </div>
    </div>
  )
}

export default Page3

const DalMakhni = () => {
  ;<div className="flex flex-col sm:flex-row w-11/12 sm:max-h-[550px] md:w-8/12 bg-white rounded-xl shadow-lg overflow-hidden my-8">
    <div className="sm:w-1/2 flex flex-col p-6 sm:p-8 md:p-10">
      <h1 className="text-3xl md:text-[3.3vw] font-bold mt-6 sm:mt-10">
        Dal Makhni
      </h1>
      <p className="text-base sm:text-md md:text-lg font-medium mt-4 md:mt-6 mb-6 sm:mb-10">
        Discover the star of our menu: Dal Makhni. Slow-cooked lentils infused
        with aromatic spices create a rich, creamy stew that's both comforting
        and flavorful. Served with fragrant basmati rice, it's a delicious
        journey for your taste buds that you won't want to miss. Taste the
        tradition, experience the magic - only at our restaurant!
      </p>
      <a href="#menu">
        <button className="relative hover:bg-green-400 w-[150px] px-4 py-2 text-sm font-semibold text-white bg-black border-2 border-black rounded-full z-10 overflow-hidden ">
          Explore More
        </button>
      </a>
    </div>

    <div className="sm:w-1/2 h-full sm:h-full">
      <img
        src={dalmakh}
        alt="Dal Makhni"
        className="w-full h-full object-cover object-center rounded-e-xl"
      />
    </div>
  </div>
}
