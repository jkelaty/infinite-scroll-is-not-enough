import React from "react"
import { Link, navigate } from "gatsby"

import { Search, Clear, Settings } from "./icons"
import Logo from "../../content/assets/logo.png"

import "../styles/navbar.scss"

var inputRef = React.createRef();

function onEnter(e) {
  if (e.key === 'Enter' && e.target.value !== '') {
    navigate('/tweets?user=' + e.target.value)
  }
  else if (e.key === 'Escape') {
    clearInput()
  }
}

function clearInput() {
  inputRef.current.value = ''
}

const NavBar = ({ title, toggleModal }) => {
  const placeHolderText = `Generate tweets for @user`

  return (
    <>
      <div className={`navbar`}>
        <div className={`navbar-inner`}>

          <div className={`navbar-logo-wrapper`}>
            <Link to={`/`}>
              <img className={`navbar-logo`} alt={`logo`} src={Logo} />
            </Link>
          </div>
          
          <div className={`search-bar-wrapper`}>
            <span className={`search-icon-wrapper`}>{Search}</span>

            <span className={`search-box`}>
              <input placeholder={placeHolderText} ref={inputRef} onKeyDown={(e) => onEnter(e)} />
            </span>

            <a className={`clear-icon-wrapper`} onClick={() => clearInput()}>{Clear}</a>

            <div className={`search-history-wrapper`}>
              {`SEARCH HISTORY`}
            </div>
          </div>

          <div className={`settings-icon-wrapper`}>
            <a onClick={toggleModal}>{Settings}</a>
          </div>

        </div>
      </div>
    </>
  )
}

export default NavBar

