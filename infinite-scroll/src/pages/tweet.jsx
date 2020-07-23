import React from "react"
import queryString from 'query-string'

import Index from "./index.jsx"
import Tweet from "../components/tweet"

class SingleTweet extends Index {
  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      error: false,
      id: queryString.parse(props.location.search).id
    }
  }

  fetchTweets() {
    fetch('https://infinite-scroll-is-not-enough.herokuapp.com/tweet/' + this.state.id, { method: 'Get' })
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

        let _tweet = <Tweet tweet={tweet_arr[0]} key={tweet_arr[0].id} />

        this.setState({
          tweets: _tweet,
          canLoadMore: false,
          loadingTweets: false
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

export default SingleTweet

