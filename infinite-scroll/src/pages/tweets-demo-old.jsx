import React from "react"
import queryString from 'query-string'

import Index from "./index.jsx"
import Tweet from "../components/tweet"

// Modified for demo
class GeneratedTweets extends Index {
  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      error: false,
      currentPage: 0,
      user: queryString.parse(props.location.search).user
    }
  }

  static getDerivedStateFromProps(props, state) {
    let new_user = queryString.parse(props.location.search).user

    if (new_user !== state.user) {
      return {
        tweets: [],
        canLoadMore: true,
        loadingTweets: true,
        error: false,
        currentPage: 0,
        user: new_user
      }
    }

    return null
  }

  componentDidUpdate() {
    if (this.state.canLoadMore && this.state.currentPage === 0) {
      this.fetchTweets()
    }
  }

  fetchTweets() {
    fetch('https://infinite-scroll-is-not-enough.herokuapp.com/generate/' + this.state.user + '/' + this.state.currentPage, { method: 'Get' })
      .then(response => response.text())
      .then((res) => {
        let tweet_arr = JSON.parse(res)

        if (tweet_arr.length === 0) {
          this.setState({
            canLoadMore: false,
            loadingTweets: false,
            error: true 
          })
        }
        
        let _tweets = []

        for (let i = 0; i < tweet_arr.length; ++i) {
          _tweets.push(<Tweet tweet={tweet_arr[i]} key={tweet_arr[i].id} />)
        }

        this.setState({
          tweets: this.state.tweets.concat(_tweets),
          loadingTweets: false,
          currentPage: this.state.currentPage + 1
        })
      })
      .catch(error => {
        this.setState({
          canLoadMore: false,
          loadingTweets: false,
          error: true 
        })
      })
  }
}

export default GeneratedTweets

