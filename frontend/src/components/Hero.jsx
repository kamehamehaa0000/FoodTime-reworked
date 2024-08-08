import React from 'react'
import img1 from '../assets/1.webp'
import img2 from '../assets/2.webp'
import img3 from '../assets/3.webp'
import img4 from '../assets/4.webp'

const Hero = () => {
  return (
    <div className="w-full flex flex-col rounded-3xl bg-stone-900 sm:flex-row overflow-hidden justify-between items-center">
      <div className="w-full sm:w-1/2 p-4 md:p-16 h-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-[4vw] text-white font-bold leading-tight">
          Something hot.
        </h1>
        <h1 className="text-5xl md:text-[4vw] text-white font-bold leading-tight">
          Something tasty.
        </h1>
        <p className="text-md md:text-[1.2vw] leading-tight my-1 md:my-4 text-white">
          At Food Time - your destination for menu viewing, reservations, and
          easy dine-in or takeaway ordering of Aromatic, Delicious, Flavorful,
          mouth-watering, Nutritious, Satisfying, Savory, Tasty, Yummy,
          Appetizing, Delectable, Saccharine Food.
        </p>
        <a href="#menu">
          <button
            className="relative my-4 px-4 py-2 rounded-full
            bg-white isolation-auto z-10 border-2 border-neutral-50 
            before:absolute before:w-full before:transition-all before:duration-700 
            before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full
            before:bg-green-400 text-black before:-z-10 before:aspect-square
            before:hover:scale-150 overflow-hidden before:hover:duration-700 text-md font-semibold"
          >
            Explore More
          </button>
        </a>
      </div>

      <div className="w-full sm:w-1/2 p-4 h-full lg:max-h-[70vh]  grid grid-cols-2 grid-rows-2 gap-0  ">
        <div className="col-span-1 row-span-1">
          <img
            src={img1}
            className="w-full h-full object-cover object-center rounded-tl-xl"
            alt=""
          />
        </div>
        <div className="col-span-1 row-span-1">
          <img
            src={img2}
            className="w-full h-full object-cover rounded-tr-xl"
            alt=""
          />
        </div>
        <div className="col-span-1 row-span-1">
          <img
            src={img3}
            className="w-full h-full object-cover rounded-bl-xl"
            alt=""
          />
        </div>
        <div className="col-span-1 row-span-1">
          <img
            src={img4}
            className="w-full h-full object-cover rounded-br-xl"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
