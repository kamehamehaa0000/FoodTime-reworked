import React, { useState } from 'react'
import { Icon } from '@iconify/react'
const TextInput = ({ label, type, placeholder, value, onChange, required }) => {
  const [seePass, setSeePass] = useState(false)
  const handleOnchange = (e) => {
    onChange(e.target.value)
  }
  return (
    <div className="">
      <p className="font-semibold text-zinc-200 ">{label} </p>
      {type === 'password' ? (
        <div className="flex items-center justify-between  border-black rounded-lg p-[2px] my-2">
          <input
            className="w-11/12  text-black border:none  rounded-lg   px-2 font-medium  p-1 outline-none"
            type={seePass ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={handleOnchange}
            required={required}
          />
          <button
            className="p-2 mx-1 rounded-lg bg-[#202020] text-white "
            onClick={() => {
              setSeePass((prev) => !prev)
            }}
          >
            {seePass ? (
              <Icon icon="fluent:eye-48-filled" />
            ) : (
              <Icon icon="fluent:eye-48-regular" />
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-black rounded-lg p-[2px] my-1">
          <input
            className="w-full dark:text-black border:none px-2 font-medium rounded-md p-1 outline-none"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleOnchange}
            required={required}
          />
        </div>
      )}
    </div>
  )
}

export default TextInput
