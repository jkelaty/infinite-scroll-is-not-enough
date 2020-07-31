import React from "react"
import { Helmet } from "react-helmet"

import Modal from "../components/modal"
import SEO from "../components/seo"
import NavBar from "../components/navbar"
import Favicon from "../../static/favicon.ico"

import "../styles/layout.scss"

/*
 * Main Layout Component
 * 
 * (wrapper for all pages)
 */
class Layout extends React.Component {
  constructor(props) {
    super(props)

    React.Children.only(props.children) // Assert single child

    this.siteTitle = `Infinite Scroll Is Not Enough`

    this.state = {
      showModal: true,
      demoActive: true
    }
  }

  render() {
    if (typeof document !== `undefined` && typeof window !== `undefined`) {
      if (this.state.showModal) {
        // Prevent scrolling
        let offset = window.pageYOffset
        document.body.style.position = `fixed`
        document.body.style.top = `-${offset}px`
      }
      else {
        // Allow scrolling
        let scrollY = document.body.style.top
        document.body.style.top = ``
        document.body.style.position = ``
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return (
      <>
        <Helmet><link rel="icon" href={Favicon} /></Helmet>
        <SEO title={this.siteTitle} />
  
        <Modal
          showModal={this.state.showModal}
          closeModal={() => this.toggleModal(false)}
          demoActive={this.state.demoActive}
          toggleDemo={() => this.toggleDemo()}
        />
  
        <div className={`infinite-scroll`}>
          <header>
            <NavBar openModal={() => this.toggleModal(true)} />
          </header>
  
          <main className={`tweets`}>
            {React.cloneElement(this.props.children, { demoActive: this.state.demoActive })}
          </main>
  
          <footer>
            {null}
          </footer>
        </div>
      </>
    )
  }

  // Toggles settings/instructional modal
  toggleModal(show = null) {
    this.setState({ showModal: (show ? show : ! this.state.showModal) })
  }

  // Toggles demo/generative modes
  toggleDemo() {
    this.setState({ demoActive: ! this.state.demoActive })
  }
}

export default Layout

