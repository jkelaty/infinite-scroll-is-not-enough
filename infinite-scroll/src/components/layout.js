import React, { useState } from "react"
import { Helmet } from "react-helmet"
import NavBar from "./navbar"
import Favicon from "../../static/favicon.ico"
import "./layout.scss"

const Layout = ({ title, children }) => {
  const [darkMode, toggleMode] = useState(true);

  return (
    <>
      <Helmet>
        <link rel="icon" href={Favicon} />
      </Helmet>

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
    </>
  )
}

export default Layout
