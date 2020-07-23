import React from "react"
import { Link, navigate } from "gatsby"

import { Search, Clear } from "./icons"
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

const NavBar = ({title, toggleDarkMode}) => {
  const placeHolderText = `Generate tweets for @user`

  return (
    <>
      <div className={`navbar`}>
        <div className={`navbar-inner`}>

          <Link to={`/`}>
            <img className={`navbar-logo`} alt={`logo`} src={Logo} />
          </Link>
          
          <div className={`search-bar`}>
            <span className={`search-icon-wrapper`}>{Search}</span>
            <span className={`search-box`}>
              <input placeholder={placeHolderText} ref={inputRef} onKeyDown={(e) => onEnter(e)} />
            </span>
            <a className={`clear-icon-wrapper`} onClick={() => clearInput()}>{Clear}</a>
          </div>

          <div className={`dark-mode-toggle`}>
            <span className={`light-toggle`} onClick={toggleDarkMode} />
          </div>

        </div>
      </div>
    </>
  )
}

export default NavBar
