import React from "react"
import queryString from 'query-string'
import { graphql } from "gatsby"

import Index from "./index.jsx"
import Tweet from "../components/tweet"

class SingleTweet extends Index {
  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      id: queryString.parse(props.location.search).id
    }
  }

  fetchTweets() {
    if (typeof window !== `undefined`) {
      alert(this.state.id)
    }
  }
}

export default SingleTweet

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`