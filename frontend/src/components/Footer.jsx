import React from 'react'
import { FaInstagram } from 'react-icons/fa'
import { FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <div id="footer" className="footer w-full md:text-md bg-white p-2 md:p-8">
      <div className="flex items-center justify-between border-b-2 border-black">
        <h1 className="md:text-[4vw] text-4xl mb-5 font-bold ">FoodTime.</h1>
        <h5 className=" hidden sm:block md:text-xl font-bold ">
          We treat your toung with flavours.
        </h5>
      </div>
      <div className="flex w-full ">
        <div className="w-2/3 flex justify-between md:p-5  gap-1">
          <div className="md:text-lg text-sm font-medium">
            <h1 className="md:text-[2vw] text-lg font-semibold my-2 ">
              Services
            </h1>
            <h3>Food Pre-Orders.</h3>
            <h3>Reservations.</h3>
            <h3>Menu.</h3>
            <h3>About us.</h3>
          </div>
          <div className="md:text-lg text-sm font-medium">
            <h1 className="md:text-[2vw]  font-semibold my-2   text-lg">
              Customer Care
            </h1>
            <h3>FAQs.</h3>
            <h3>Order cancellation policy,</h3>
            <h3>Taste Guide.</h3>
          </div>
          <div className="md:text-lg text-sm font-medium">
            <h1 className="md:text-[2vw] font-semibold  my-2  text-lg">Info</h1>
            <h3>Terms and Conditions.</h3>
            <h3>Privacy policy.</h3>
          </div>
        </div>
        <div className="w-[2px] bg-black h-[220px] "></div>

        <div className="flex-grow text-sm md:text-lg font-medium mx-2">
          <p>
            No spam, just pure inspiration
            <br /> and good news.
          </p>
          <div className="h-[2px] w-full bg-black my-4"></div>
          We are always close.
          <h1>Call at : +91 909456XXXX</h1>
          <h1>Email : foodtime@gmail.com</h1>
          <FaInstagram className="hidden sm:inline text-2xl mr-2" />
          <FaTwitter className=" hidden sm:inline text-2xl mr-2" />
        </div>
      </div>
    </div>
  )
}

export default Footer
