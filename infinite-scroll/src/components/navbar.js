import React from "react"
import "./navbar.css"

const NavBar = (data) => {
  return (
    <>
      <div className={`navbar`}>
        <h1>{data.title}</h1>
      </div>
    </>
  )
}

export default NavBar
