import React from 'react'
import '../404/style.css'
import { Link } from 'react-router-dom'
const NotFound = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>
            4<span></span>4
          </h1>
        </div>
        <h2>Oops! Page Not Be Found</h2>
        <br />
        <Link
          className="bg-green-400 font-semibold px-4 py-2 rounded-full"
          to="/home"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
