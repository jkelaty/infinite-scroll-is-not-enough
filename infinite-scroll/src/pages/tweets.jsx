import React from "react"
import queryString from 'query-string'

import Index from "./index.jsx"
import Tweet from "../components/tweet"

class GeneratedTweets extends Index {
  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      error: false,
      user: queryString.parse(props.location.search).user,
      count: 0
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
        user: new_user,
        count: 0
      }
    }

    return null
  }

  componentDidUpdate() {
    if (this.state.canLoadMore && this.state.count === 0) {
      this.fetchTweets()
    }
  }

  fetchTweets() {
    let _this = this

    fetch('https://infinite-scroll-is-not-enough.herokuapp.com/generate/' + this.state.user, { method: 'Get' })
      .then(response => response.text())
      .then((res) => {
        let tweet_arr = JSON.parse(res)

        if (tweet_arr.length === 0) {
          _this.setState({
            canLoadMore: false,
            loadingTweets: false,
            error: true 
          })
        }
        
        let _tweets = []

        for (let i = 0; i < tweet_arr.length; ++i) {
          _tweets.push(<Tweet tweet={tweet_arr[i]} key={i + _this.state.count} />)
        }

        _this.setState({
          tweets: _this.state.tweets.concat(_tweets),
          loadingTweets: false,
          count: _this.state.count + tweet_arr.length
        })
      })
      .catch(error => {
        _this.setState({
          canLoadMore: false,
          loadingTweets: false,
          error: true 
        })
      })
  }
}

export default GeneratedTweets

