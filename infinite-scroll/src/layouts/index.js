import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

import IntroModal from "../components/intro"
import SEO from "../components/seo"
import NavBar from "../components/navbar"
import Favicon from "../../static/favicon.ico"

import "../styles/layout.scss"

const Layout = ({ children }) => {
  const siteTitle = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata.title

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
      <IntroModal />
      <Helmet><link rel="icon" href={Favicon} /></Helmet>
      <SEO title={siteTitle} />

      <div className={`infinite-scroll`}>
        <header>
          <NavBar title={siteTitle} toggleDarkMode={() => toggleMode( ((darkMode === 'true') ? 'false' : 'true') )} />
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

