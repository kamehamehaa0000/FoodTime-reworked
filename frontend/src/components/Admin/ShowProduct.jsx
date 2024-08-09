import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import axios from 'axios'
import { useProduct } from '../../hooks/useProduct'
import Loader from '../../components/shared/Loader'
import { MdDelete } from 'react-icons/md'
import { IoIosAdd } from 'react-icons/io'
import { IoIosRemove } from 'react-icons/io'
import { FaRegEdit } from 'react-icons/fa'

const ShowProducts = () => {
  const queryClient = useQueryClient()
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    offerPercentage: '',
    imageFile: null,
  })

  const { data: products, isLoading: loadingProducts } = useProduct()

  const handleEditClick = (product) => {
    setEditingProduct(product)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  const handleSaveEdit = async () => {
    const formData = new FormData()
    formData.append('name', editingProduct.name)
    formData.append('description', editingProduct.description)
    formData.append('price', parseInt(editingProduct.price))
    formData.append('category', editingProduct.category)
    formData.append('offerPercentage', parseInt(editingProduct.offerPercentage))
    if (editingProduct.imageFile) {
      formData.append('productImage', editingProduct.imageFile)
    }
    formData.set('price', parseInt(formData.get('price')))
    formData.set('offerPercentage', parseInt(formData.get('offerPercentage')))
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/product/update/${
          editingProduct._id
        }`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      )
      setEditingProduct(null)
      queryClient.invalidateQueries('products')
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleAddProduct = async () => {
    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('description', newProduct.description)
    formData.append('price', newProduct.price)
    formData.append('category', newProduct.category)
    formData.append('offerPercentage', newProduct.offerPercentage)
    if (newProduct.imageFile) {
      formData.append('productImage', newProduct.imageFile)
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/create`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      )
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        offerPercentage: '',
        imageFile: null,
      })
      queryClient.invalidateQueries('products')
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleChangeInMenuStatus = async (productId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/product/menu/status/${productId}`,
        {},
        {
          withCredentials: true,
        }
      )
      queryClient.invalidateQueries('products')
    } catch (error) {
      console.error('Error changing menu status:', error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/product/delete/${productId}`,
        { withCredentials: true }
      )
      queryClient.invalidateQueries('products')
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loadingProducts)
    return (
      <div className="text-center text-xl">
        <Loader />
      </div>
    )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Products</h1>

      <div className="bg-gray-100 w-fit p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Add New Product</h2>
        <div className="p-4 max-w-lg text-base w-fit bg-white rounded-lg">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className=" px-2 mx-2 w-full my-1 border rounded-md"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className=" px-2 mx-2 w-full my-1 border rounded-md"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className=" px-2 mx-2 w-full my-1 border rounded-md"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className=" px-2 mx-2 w-full my-1 border rounded-md"
          />
          <input
            type="number"
            placeholder="Offer Percentage"
            value={newProduct.offerPercentage}
            onChange={(e) =>
              setNewProduct({ ...newProduct, offerPercentage: e.target.value })
            }
            className=" px-2 mx-2 w-full my-1 border rounded-md"
          />
          <input
            type="file"
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
            }
            className=" mx-2 border rounded w-full mb-2 mt-1 text-base file:border-none file:text-white file:bg-zinc-950 file:rounded-lg"
          />
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 mx-2 my-2 py-1 text-white  px-4 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Product List</h2>
        <div className="flex flex-wrap gap-5">
          {products &&
            products?.data?.map((product) => (
              <div
                key={product._id}
                className="bg-white w-fit p-1 rounded-lg shadow-md flex flex-col "
              >
                {editingProduct && editingProduct._id === product._id ? (
                  <div className="p-4 text-base max-w-lg">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className=" px-2 mx-2 w-full my-1 border rounded-md"
                    />
                    <input
                      type="text"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      className=" px-2 mx-2 w-full my-1 border rounded-md"
                    />
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                      className=" px-2 mx-2 w-full my-1 border rounded-md"
                    />
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className=" px-2 mx-2 w-full my-1 border rounded-md"
                    />
                    <input
                      type="number"
                      value={editingProduct.offerPercentage}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          offerPercentage: e.target.value,
                        })
                      }
                      className=" px-2 mx-2 w-full my-1 border rounded-md"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          imageFile: e.target.files[0],
                        })
                      }
                      className=" mx-2 border rounded w-full mb-2 mt-1 text-base file:border-none file:text-white file:bg-zinc-950 file:rounded-lg"
                    />
                    <div>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white mx-2  my-2 px-4 rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 text-white my-2 px-4 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-fit p-4 max-w-lg font-semibold text-base">
                    <div className="w-1/2">
                      <div className="rounde bg-[#FFFFFF] px-2 w-full">
                        <h2 className="text-left text-zinc-800 text-lg font-semibold ">
                          {product.name}
                        </h2>
                        <h3 className="text-sm text-blue-500 text-left font-semibold my-1 ">
                          {product.category}
                        </h3>
                        <h3 className="text-sm text-left font-semibold my-1 ">
                          {product.description}
                        </h3>{' '}
                        <div className=" text-sm w-full text-left inline-block font-semibold text-gray-900">
                          Rs. {product.price}
                        </div>{' '}
                        <p className="text-sm">
                          Offer: {product.offerPercentage}%
                        </p>
                      </div>
                    </div>

                    <div className=" w-1/2 relative overflow-hidden ">
                      <img
                        src={product.imageUrl}
                        className="h-32 w-full transition-all ease-in-out duration-500 hover:scale-110  object-cover object-center"
                      />{' '}
                      <div className="flex items-center justify-center my-2 gap-2 text-base">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-zinc-800 w-fit text-white px-2 py-1 text-xl rounded-md hover:bg-yellow-600"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-zinc-800  w-fit text-white  px-2 py-1  text-xl rounded-md hover:bg-red-600"
                        >
                          <MdDelete />
                        </button>
                        <button
                          onClick={() => handleChangeInMenuStatus(product._id)}
                          className={`  px-2 py-1 w-fit text-xl rounded-md ${
                            product.inMenu ? 'bg-zinc-800 ' : 'bg-blue-500'
                          } text-white hover:${
                            product.inMenu ? 'bg-zinc-800 ' : 'bg-blue-600'
                          }`}
                        >
                          {product.inMenu ? <IoIosRemove /> : <IoIosAdd />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ShowProducts
