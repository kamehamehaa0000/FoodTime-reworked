import React, { useState } from 'react'
import ProductCard from './ProductCard'
import Loader from './shared/Loader'
import {
  useProduct,
  useCategories,
  useProductsByCategory,
} from '../hooks/useProduct'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [page, setPage] = useState(1)

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories()

  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
  } = useProductsByCategory(selectedCategory, page)

  const productList = Array.isArray(productsResponse?.data?.products)
    ? productsResponse?.data?.products
    : []

  const hasMoreProducts = page < productsResponse?.data?.totalPages

  if (productsLoading || categoriesLoading)
    return (
      <div className="w-full bg-[#] my-4 rounded-3xl mt-10">
        <h1 className="text-xl md:text-4xl w-fit font-bold">Products</h1>
        <Loader />
      </div>
    )

  if (productsError || categoriesError)
    return (
      <div className="w-full bg-[#] my-4 rounded-3xl mt-10">
        <h1 className="text-xl md:text-4xl w-fit font-bold">Products</h1>
        <h1 className="text-center">
          Error Loading the Products or Categories.
        </h1>
      </div>
    )

  return (
    <div id="menu" className="w-full bg-[#] my-4 rounded-3xl mt-10">
      <h1 className="text-xl md:text-4xl w-fit font-bold">Products</h1>

      <div className="my-4 flex flex-wrap">
        <button
          onClick={() => {
            setSelectedCategory('all')
            setPage(1)
          }}
          className={`px-4 mx-1 my-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-zinc-800 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          All
        </button>
        {categories?.data?.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category)
              setPage(1)
            }}
            className={`px-4 mx-1 my-2 rounded-full ${
              selectedCategory === category
                ? 'bg-zinc-800 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {productList.map((product, index) => {
          const discountedPrice =
            product.price - (product.offerPercentage / 100) * product.price
          return (
            <ProductCard
              title={product.name}
              key={index}
              category={product.category}
              img={product.imageUrl}
              originalPrice={product.price}
              discountedPrice={discountedPrice}
              _id={product._id}
              offer={product.offerPercentage.toString()}
            />
          )
        })}
      </div>

      <div className="flex text-base font-semibold justify-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-l-lg"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-white text-gray-800 border-t border-b">
          {page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-lg"
          disabled={!hasMoreProducts}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Products
