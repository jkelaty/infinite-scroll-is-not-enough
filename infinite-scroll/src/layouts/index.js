import React from "react"
import { Helmet } from "react-helmet"

import Modal from "../components/modal"
import SEO from "../components/seo"
import NavBar from "../components/navbar"
import Favicon from "../../static/favicon.ico"

import "../styles/layout.scss"

class Layout extends React.Component {
  constructor(props) {
    super(props)

    React.Children.only(props.children)

    this.siteTitle = `Infinite Scroll Is Not Enough`

    this.state = {
      showModal: true,
      demoActive: true
    }
  }

  render() {
    if (typeof document !== `undefined`) {
      document.body.style.overflowY = (this.state.showModal ? 'hidden' : 'visible')
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

  toggleModal(show = null) {
    this.setState({ showModal: (show ? show : ! this.state.showModal) })
  }

  toggleDemo() {
    this.setState({ demoActive: ! this.state.demoActive })
  }
}

export default Layout

