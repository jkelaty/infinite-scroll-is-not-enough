import React from "react"
import { Link, navigate } from "gatsby"
import { MoonLoader } from "react-spinners"

import { Search, Clear, Settings } from "./icons"
import Logo from "../../content/assets/logo.png"

import "../styles/navbar.scss"

class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.inputRef  = React.createRef()
    this.clearRef  = React.createRef()
    this.searchRef = React.createRef()

    this.searchQueriesMaxLength = 5
    this.placeHolderText = `Generate tweets for @user`
    this.openModal = props.openModal

    this.state = {
      searchHistory: null
    }
  }

  componentDidMount() {
    this.initSearchHistory()
  }

  render() {
    var searchHistory = []
  
    if (this.state.searchHistory !== null) {
      for (let i = 0; i < this.state.searchHistory.length; ++i) {
        if (this.state.searchHistory[i].type === 'search') {
          searchHistory.push(
            <div className={`search-history-entry`} key={i} onClick={() => this.generateUser(this.state.searchHistory[i].query)}>
              <span className={`search-history-item`}>
                {Search}
                <span className={`search-history-query`}>{this.state.searchHistory[i].query}</span>
              </span>
              <a className={`search-history-clear clear-single`} onClick={(e) => this.clearSearchQuery(e, i)}>{Clear}</a>
            </div>
          )
        }
        else if (this.state.searchHistory[i].type == 'profile') {
          searchHistory.push(
            <div className={`search-history-entry`} key={i} onClick={() => this.generateUser(this.state.searchHistory[i].query)}>
              <span className={`search-history-item`}>
                <img className={`search-history-profile-image`} src={this.state.searchHistory[i].image} />
                <span className={`search-history-profile-data`}>
                  <div className={`search-history-profile-name`}>{this.state.searchHistory[i].name}</div>
                  <div className={`search-history-profile-handle`}>{`@` + this.state.searchHistory[i].query}</div>
                </span>
              </span>
              <a className={`search-history-clear clear-single`} onClick={(e) => this.clearSearchQuery(e, i)}>{Clear}</a>
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
            
            <div className={`search-bar-wrapper`}>
              <span className={`search-icon-wrapper`}>
                {Search}
              </span>

              <input className={`search-box`} placeholder={this.placeHolderText} ref={this.inputRef} tabIndex={`0`} onKeyDown={(e) => this.onKeyPress(e)} />

              <a className={`clear-icon-wrapper`} ref={this.clearRef} tabIndex={`0`} onKeyDown={(e) => this.onKeyPress(e)} onClick={() => this.clearInput()}>
                {Clear}
              </a>
              
              <div className={`search-history-wrapper`} ref={this.searchRef} tabIndex={`0`} onKeyDown={(e) => this.onKeyPress(e)}>
  
                {(this.state.searchHistory === null) ?

                  <div className={`loading-search-history`}>
                    <MoonLoader size={30} color={`#1DA1F2`} />
                  </div>

                : (searchHistory.length > 0) ?

                  <div className={`search-history-entry header`}>
                    <span className={`search-history-item header`}>{`Recent`}</span>
                    <a className={`search-history-clear clear-all`} onClick={(e) => this.clearSearchQuery(e, true)}>{`Clear all`}</a>
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
              <a onClick={this.openModal}>{Settings}</a>
            </div>
  
          </div>
        </div>
      </>
    )
  }

  async initSearchHistory() {
    let searchHistory = []
    let searchQueries = []

    if (typeof window !== `undefined`) {
      searchQueries = JSON.parse(window.localStorage.getItem('search-history') || `[]`)
    }

    for (let i = 0; i < Math.min(searchQueries.length, this.searchQueriesMaxLength); ++i) {
      searchHistory.push( await this.getQueryData(searchQueries[i]))
    }

    this.setState({ 'searchHistory': searchHistory })
  }

  async getQueryData(query) {
    return await fetch('https://infinite-scroll-is-not-enough.herokuapp.com/query/' + query, { method: 'Get' })
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

  clearSearchQuery(e, index) {
    e.preventDefault()
    e.stopPropagation()

    let searchHistory = []

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

  addSearchQuery(query) {
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
  
  generateUser(handle) {
    this.unfocus()
    this.addSearchQuery(handle)
    navigate('/tweets?user=' + handle)
  }

  onKeyPress(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      this.unfocus()
      this.addSearchQuery(e.target.value)
      navigate('/tweets?user=' + e.target.value)
    }
    else if (e.key === 'Escape') {
      this.clearInput()
    }
  }

  clearInput() {
    this.unfocus()
    this.inputRef.current.value = ''
  }

  unfocus() {
    this.inputRef.current.blur()
    this.clearRef.current.blur()
    this.searchRef.current.blur()
  }
}

export default NavBar

