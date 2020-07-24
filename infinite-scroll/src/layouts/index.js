import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

import Modal from "../components/modal"
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

  const [showModal, toggleModal] = useState(true)

  useEffect(() => {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem('intro', showModal ? 'show' : 'hide')
    }
    if (typeof document !== `undefined`) {
      document.body.style.overflowY = (showModal ? 'hidden' : 'visible')
    }
  })

  return (
    <>
      <Helmet><link rel="icon" href={Favicon} /></Helmet>
      <SEO title={siteTitle} />

      <Modal showModal={showModal} closeModal={() => toggleModal(false)} />

      <div className={`infinite-scroll`}>
        <header>
          <NavBar openModal={() => toggleModal(true)} />
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

