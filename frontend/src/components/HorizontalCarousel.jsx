import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
const HorizontalCarousel = () => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      className="bg-black rounded m-8"
    >
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[0]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[1]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[2]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[3]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[4]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[5]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
      <SwiperSlide>
        <div
          style={{
            background: `url(${imgs[6]})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          className=" flex w-full h-[400px] bg-zinc-900 items-center justify-center"
        ></div>
      </SwiperSlide>
    </Swiper>
  )
}

export default HorizontalCarousel
const imgs = [
  'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2016/1/25/0/FN_getty-italian-traditions-pasta_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1453776834832.jpeg',
  'https://insanelygoodrecipes.com/wp-content/uploads/2020/12/Homemade-Ground-Beef-Lasagna.png',
  'https://i0.wp.com/cms.babbel.news/wp-content/uploads/2019/04/ItalianFood.png?fit=1200%2C675&strip=none&ssl=1',
  'https://img.freepik.com/premium-photo/delicious-home-made-lasagna-with-beef-sauce-spinach-tomato-rustic-wooden-background-home-cooked-italian-food_872147-391.jpg',
  'https://www.eatthis.com/wp-content/uploads/sites/4/2022/09/friends-having-pasta-dinner-white-wine.jpg?quality=82&strip=1',
  'https://americadomani.com/wp-content/uploads/2023/05/ice-cream-sandwich-america-domani-scaled.jpg',
  'https://media.istockphoto.com/id/1194248300/photo/pasta-with-pork-sauce-and-vegetables-on-color-gradient-background.jpg?s=612x612&w=0&k=20&c=FaPyoHBXXBHkZpoIvAktRilyDX5sy09xTrHUnwaF5i0=',
]
