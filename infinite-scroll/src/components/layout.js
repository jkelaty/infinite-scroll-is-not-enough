import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"

import Intro from "./intro"
import NavBar from "./navbar"
import Favicon from "../../static/favicon.ico"

import "../styles/layout.scss"

const Layout = ({ title, children }) => {
  const [darkMode, toggleMode] = useState(
    (typeof window !== `undefined`)
      ? (window.localStorage.getItem('ui-dark-mode') || 'false')
      : 'false'
  )

  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem('ui-dark-mode', darkMode)
    }
  })
  
  if (typeof document !== `undefined`) {
    if (darkMode === 'true') {
      document.getElementsByTagName('html')[0].classList.add('ui-dark-mode')
    }
    else {
      document.getElementsByTagName('html')[0].classList.remove('ui-dark-mode')
    }
  }

  return (
    <>
      <Intro />

      <Helmet>
        <link rel="icon" href={Favicon} />
      </Helmet>

      <div className={`infinite-scroll`}>
        <header>
          <NavBar title={title} toggleDarkMode={() => toggleMode( ((darkMode === 'true') ? 'false' : 'true') )} />
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
