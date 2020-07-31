import React from "react"
import { Link, navigate } from "gatsby"
import { MoonLoader } from "react-spinners"

import { Search, Clear, Settings } from "./icons"
import Logo from "../../content/assets/logo.png"

import "../styles/navbar.scss"

/*
 * Navigation Bar Component
 * 
 * Handles search bar + search history. Also provides
 * links to home page and to show intro modal
 */
class NavBar extends React.Component {
  constructor(props) {
    super(props)

    // Refs required for search bar functionality
    this.wrapperRef = React.createRef()
    this.inputRef   = React.createRef()
    this.clearRef   = React.createRef()
    this.searchRef  = React.createRef()

    this.searchQueriesMaxLength = 5 // Max number of search queries to store
    this.placeHolderText = `Generate tweets for @user`
    this.openModal = props.openModal // Callback to open intro modal

    this.state = {
      searchHistory: null,
      searchActive: false
    }

    this.clickCallback = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.initSearchHistory()

    // Create listener to detect click to 'focus' search bar
    if (typeof window !== `undefined`) {
      window.addEventListener('mousedown', this.clickCallback, true)
    }
  }

  componentWillUnmount() {
    // Remove listener
    if (typeof window !== `undefined`) {
      window.removeEventListener('mousedown', this.clickCallback, true)
    }
  }

  render() {
    var searchHistory = []
  
    if (this.state.searchHistory !== null) {
      for (let i = 0; i < this.state.searchHistory.length; ++i) {
        if (this.state.searchHistory[i].type === `search`) {
          searchHistory.push(
            <div className={`search-history-entry`} key={i} onClick={() => this.generateUser(this.state.searchHistory[i].query)}>
              <span className={`search-history-item`}>
                {Search}
                <span className={`search-history-query`}>{this.state.searchHistory[i].query}</span>
              </span>
              <span className={`search-history-clear clear-single`} onClick={(e) => this.clearSearchQuery(e, i)}>{Clear}</span>
            </div>
          )
        }
        else if (this.state.searchHistory[i].type === `profile`) {
          searchHistory.push(
            <div className={`search-history-entry`} key={i} onClick={() => this.generateUser(this.state.searchHistory[i].query)}>
              <span className={`search-history-item`}>
                <img className={`search-history-profile-image`} src={this.state.searchHistory[i].image} alt={`tweet-profile`} />
                <span className={`search-history-profile-data`}>
                  <div className={`search-history-profile-name`}>{this.state.searchHistory[i].name}</div>
                  <div className={`search-history-profile-handle`}>{`@${this.state.searchHistory[i].query}`}</div>
                </span>
              </span>
              <span className={`search-history-clear clear-single`} onClick={(e) => this.clearSearchQuery(e, i)}>{Clear}</span>
            </div>
          )
        }
      }
    }

    return (
      <>
        <div className={`navbar`}>
          <div className={`navbar-inner`}>
  
            <div className={`navbar-logo-wrapper`}>
              <Link to={`/`}>
                <img className={`navbar-logo`} alt={`logo`} src={Logo} />
              </Link>
            </div>
            
            <div className={`search-bar-wrapper` + (this.state.searchActive ? ` active` : ``)} ref={this.wrapperRef}>
              <span className={`search-icon-wrapper`}>
                {Search}
              </span>

              <input className={`search-box`} placeholder={this.placeHolderText} ref={this.inputRef} tabIndex={`0`} onKeyDown={(e) => this.onKeyPress(e)} />

              <span className={`clear-icon-wrapper`} ref={this.clearRef} tabIndex={`0`} onKeyDown={(e) => this.onKeyPress(e)} onClick={() => this.clearInput()}>
                {Clear}
              </span>
              
              <div className={`search-history-wrapper`} ref={this.searchRef} tabIndex={`0`} onKeyDown={(e) => this.onKeyPress(e)}>
  
                {(this.state.searchHistory === null) ?
                  <div className={`loading-search-history`}>
                    <MoonLoader size={30} color={`#1DA1F2`} />
                  </div>
                : (searchHistory.length > 0) ?
                  <div className={`search-history-entry header`}>
                    <span className={`search-history-item header`}>{`Recent`}</span>
                    <span className={`search-history-clear clear-all`} onClick={(e) => this.clearSearchQuery(e, true)}>{`Clear all`}</span>
                  </div>
                :
                  <div className={`search-history-empty`}>
                    {`Try searching for a Twitter handle`}
                  </div>
                }

                {searchHistory}

              </div>
            </div>
  
            <div className={`info-icon-wrapper`}>
              <span onClick={this.openModal}>{Settings}</span>
            </div>
  
          </div>
        </div>
      </>
    )
  }

  // Parses local storage (if set) and creates state object
  async initSearchHistory() {
    let searchHistory = []
    let searchQueries = []

    if (typeof window !== `undefined`) {
      searchQueries = JSON.parse(window.localStorage.getItem('search-history') || `[]`)
    }

    for (let i = 0; i < Math.min(searchQueries.length, this.searchQueriesMaxLength); ++i) {
      searchHistory.push( await this.getQueryData(searchQueries[i]) ) // async call
    }

    this.setState({ 'searchHistory': searchHistory })
  }

  // API request to retrieve user data for search history entry
  async getQueryData(query) {
    return await fetch(`https://infinite-scroll-is-not-enough.herokuapp.com/query/${query}`, { method: 'Get' })
      .then(res => res.json())
      .then(query_data => {
        return query_data
      })
      .catch(error => {
        return {
          'type': 'query',
          'query': query
        }
      })
  }

  handleClick(e) {
    // If search bar wrapper contains our clicked target,
    // set search bar as active, else set as inactive
    if (this.wrapperRef.current.contains(e.target)) {
      this.setState({ searchActive: true })
    }
    else {
      this.setState({ searchActive: false })
    }
  }

  // Handle clearing a search query
  clearSearchQuery(e, index) {
    e.preventDefault()
    e.stopPropagation()

    let searchHistory = []

    // Removes search query index if set, otherwise removes all
    if (index !== true) {
      searchHistory = this.state.searchHistory
      searchHistory.splice(index, 1)
    }

    if (typeof window !== `undefined`) {
      let searchQueries = []
      for (let i = 0; i < searchHistory.length; ++i) {
        searchQueries.push(searchHistory[i].query)
      }
      window.localStorage.setItem('search-history', JSON.stringify(searchQueries))
    }

    this.setState({ 'searchHistory': searchHistory })
  }

  // Adds search query (to beginning) of array
  addSearchQuery(query) {
    // Remove leading '@' symbol
    if (query && query[0] === '@') {
      query = query.substr(1)
    }

    let searchQueries = JSON.parse(window.localStorage.getItem('search-history') || `[]`)
    searchQueries = searchQueries.filter(entry => entry.toLowerCase() !== query.toLowerCase())
    searchQueries.unshift(query)
    searchQueries.splice(this.searchQueriesMaxLength)
    window.localStorage.setItem('search-history', JSON.stringify(searchQueries))

    this.initSearchHistory()
  }
  
  // Callback to generate tweets for
  // selected user from search history
  generateUser(handle) {
    this.unfocus()
    this.addSearchQuery(handle)
    navigate(`/tweets?user=${handle}`)
  }

  // Detects keypress while search bar is in focus
  onKeyPress(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      this.unfocus()
      this.addSearchQuery(e.target.value)
      navigate(`/tweets?user=${e.target.value}`)
    }
    else if (e.key === 'Escape') {
      this.clearInput()
      this.unfocus()
    }
  }

  // Clear input search field
  clearInput() {
    this.inputRef.current.value = ''
    this.inputRef.current.focus()
  }

  // Unfocus all search elements
  unfocus() {
    this.inputRef.current.blur()
    this.clearRef.current.blur()
    this.searchRef.current.blur()
    this.setState({ searchActive: false })
  }
}

export default NavBar

