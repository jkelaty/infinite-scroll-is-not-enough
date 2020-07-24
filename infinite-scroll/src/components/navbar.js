import React from "react"
import { Link, navigate } from "gatsby"

import { Search, Clear, Settings } from "./icons"
import Logo from "../../content/assets/logo.png"

import "../styles/navbar.scss"

const inputRef  = React.createRef()
const clearRef  = React.createRef()
const searchRef = React.createRef()

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

  inputRef.current.blur()
  clearRef.current.blur()
  searchRef.current.blur()
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
            <input className={`search-box`} placeholder={placeHolderText} ref={inputRef} tabIndex={`0`} onKeyDown={(e) => onEnter(e)} />
            <a className={`clear-icon-wrapper`} ref={clearRef} tabIndex={`0`} onKeyDown={(e) => onEnter(e)} onClick={() => clearInput()}>{Clear}</a>
            <div className={`search-history-wrapper`} ref={searchRef} tabIndex={`0`} onKeyDown={(e) => onEnter(e)}>

              <div className={`search-history-entry header`}>
                <span className={`search-history-item header`}>{`Recent`}</span>
                <a className={`search-history-clear clear-all`}>{`Clear all`}</a>
              </div>
              
              <div className={`search-history-entry`}>
                <span className={`search-history-item`}>{Search}{`search a`}</span>
                <a className={`search-history-clear clear-single`}>{Clear}</a>
              </div>
              
              <div className={`search-history-entry`}>
                <span className={`search-history-item`}>
                  <img className={`search-history-profile-image`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAwFBMVEXM1t3K1dy5xc2xvca7xs+KmaVrfYtld4agrrhneYhoeoiksbufrbegrbe7xs66xs6Dk5+/ytKdqrWElKCDk6Byg5HG0NjEz9bH0dlqfIprfIuAkJ2ir7nJ09p1hpN0hZO9yNDH0tmbqbTBzNOzv8iqtsCotL6ntL7L1dy3w8yjsLqVpK+Onam8x9CRn6ttf43CzdWMm6dmeIeLmqauusSwvMVxgpCToa29ydFneIeRoKzK1Nttfo2yvseZp7KHl6OOgUPZAAAA80lEQVR4Ae3SA5oDQRgE0Aortm1zNub9T7Xm4O/+uMo7w8O/duNyezxuF3R5fX4+8vu80BII8lUoDA0RfhKFUizIT4JxqCT4RQIKSZokIUvRJAVZmiYZyLI0yUIWpEkQohwtcpDkaZGHpECLAkRFmpQgK9OkDFmFJhXIqjV+Ua9CoZHlJ9kGlJqtLF9lW01oaXe6vX6308aPMRiOxpPJeDQcQMd0Nuer+WwKlcXS4CfG3QKi1Zwm8xUEAYMWRkAZSbvT2qAtYw1bzQ0dbJqws6WjLWzs9nS038HqQMEBFscTBacjzDoUnWF2oegCsytFV7x6ADhgICRy9ELGAAAAAElFTkSuQmCC" />
                  <span className={`search-history-profile-data`}>
                    <div className={`search-history-profile-name`}>{`person a`}</div>
                    <div className={`search-history-profile-handle`}>{`@person_a`}</div>
                  </span>
                </span>
                <a className={`search-history-clear clear-single`}>{Clear}</a>
              </div>
              
              <div className={`search-history-entry`}>
                <span className={`search-history-item`}>{Search}{`search b`}</span>
                <a className={`search-history-clear clear-single`}>{Clear}</a>
              </div>
              
              <div className={`search-history-entry`}>
                <span className={`search-history-item`}>{Search}{`search c`}</span>
                <a className={`search-history-clear clear-single`}>{Clear}</a>
              </div>
              
              <div className={`search-history-entry`}>
                <span className={`search-history-item`}>
                  <img className={`search-history-profile-image`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAwFBMVEXM1t3K1dy5xc2xvca7xs+KmaVrfYtld4agrrhneYhoeoiksbufrbegrbe7xs66xs6Dk5+/ytKdqrWElKCDk6Byg5HG0NjEz9bH0dlqfIprfIuAkJ2ir7nJ09p1hpN0hZO9yNDH0tmbqbTBzNOzv8iqtsCotL6ntL7L1dy3w8yjsLqVpK+Onam8x9CRn6ttf43CzdWMm6dmeIeLmqauusSwvMVxgpCToa29ydFneIeRoKzK1Nttfo2yvseZp7KHl6OOgUPZAAAA80lEQVR4Ae3SA5oDQRgE0Aortm1zNub9T7Xm4O/+uMo7w8O/duNyezxuF3R5fX4+8vu80BII8lUoDA0RfhKFUizIT4JxqCT4RQIKSZokIUvRJAVZmiYZyLI0yUIWpEkQohwtcpDkaZGHpECLAkRFmpQgK9OkDFmFJhXIqjV+Ua9CoZHlJ9kGlJqtLF9lW01oaXe6vX6308aPMRiOxpPJeDQcQMd0Nuer+WwKlcXS4CfG3QKi1Zwm8xUEAYMWRkAZSbvT2qAtYw1bzQ0dbJqws6WjLWzs9nS038HqQMEBFscTBacjzDoUnWF2oegCsytFV7x6ADhgICRy9ELGAAAAAElFTkSuQmCC" />
                  <span className={`search-history-profile-data`}>
                    <div className={`search-history-profile-name`}>{`person b`}</div>
                    <div className={`search-history-profile-handle`}>{`@person_b`}</div>
                  </span>
                </span>
                <a className={`search-history-clear clear-single`}>{Clear}</a>
              </div>

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

