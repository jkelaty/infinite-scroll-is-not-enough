import React, { useState } from "react"
import NavBar from "./navbar"
import "./layout.scss"

const Layout = ({ title, children }) => {
  const [darkMode, toggleMode] = useState(true);

  return (
    <div className={`infinite-scroll` + (darkMode ? ` ui-dark-mode` : ``)}>
      <header>
        <NavBar title={title} toggleDarkMode={() => toggleMode(!darkMode)} />
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
