import React from "react"
import queryString from "query-string"

import Index from "./index.jsx"
import Tweet from "../components/tweet"

/*
 * Single Tweet Page
 * 
 * Displays single tweet for sharing functionality
 */
class SingleTweet extends Index {
  // Retrieves state object - overriden for derived pages
  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      error: false,
      id: queryString.parse(props.location.search).id
    }
  }

  // Fetches tweets from backend API - overriden for derived pages
  fetchTweets() {
    fetch(`https://infinite-scroll-is-not-enough.herokuapp.com/tweet/${this.state.id}`, { method: 'Get' })
      .then(res => res.json())
      .then(tweet_arr => {
        if (tweet_arr.length === 0) {
          this.setState({
            canLoadMore: false,
            loadingTweets: false,
            error: true 
          })
        }

        let tweet = <Tweet tweet={tweet_arr[0]} key={tweet_arr[0].id} />

        this.setState({
          tweets: tweet,
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

