import React from "react"
import NavBar from "./navbar"
import "./layout.scss"

const Layout = ({ title, children }) => {
  var darkMode = false;

  return (
    <div className={`infinite-scroll` + (darkMode ? ` ui-dark-mode` : ``)}>
      <header>
        <NavBar title={title}/>
      </header>

      <main className={`tweets`}>
        {children}
      </main>

      <footer>
      </footer>
    </div>
  )
}

export default Layout

// TODO:
// dark mode
// navbar search + logo
// infinite scroll
// like tweet animation + callback
// share + callback

// navbar: dark mode toggle, logo, info, and search bar
