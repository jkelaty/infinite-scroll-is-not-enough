import React from "react"
import queryString from 'query-string'
import { graphql } from "gatsby"

import Index from "./index.jsx"
import Tweet from "../components/tweet"

class GeneratedTweets extends Index {
  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      user: queryString.parse(props.location.search).user
    }
  }

  fetchTweets() {
    if (typeof window !== `undefined`) {
      alert(this.state.user)
    }
  }
}

export default GeneratedTweets

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`