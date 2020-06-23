import React from "react"
import queryString from 'query-string'
import { graphql } from "gatsby"
import { MoonLoader } from "react-spinners"

import Tweet from "../components/tweet"
import Layout from "../components/layout"
import SEO from "../components/seo"

class Index extends React.Component {
  constructor(props) {
    super(props)
    
    this.siteTitle = props.data.site.siteMetadata.title
    this.loadingElement = <div className={`loading-tweets`}><MoonLoader size={30} color={`#1DA1F2`} /></div>

    this.tweets = []
    this.count = 10
    this.user = null

    for (let i = 0; i < this.count; ++i) {
      this.tweets.push(<Tweet key={i} />)
    }

    // if (props.location.search) {
    //   this.user = queryString.parse(props.location.search).user
    // }

    this.state = {
      canLoadMore: true,
      loadingTweets: false
    }

    this.scrollCallback = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.handleScroll())
  }

  componentWillUnmount() {
    window.removeEventListener('scroll')
  }

  render() {
    return (
      <Layout title={this.siteTitle}>
        <SEO title={this.siteTitle} />
        {this.tweets}
        {this.state.loadingTweets ? this.loadingElement : null}
      </Layout>
    )
  }

  getTweets() {
    //alert("Get Tweets")
  }

  handleScroll() {
    if (this.state.canLoadMore) {
      let maxPosition     = document.body.scrollHeight + 54 - 100
      let currentPosition = window.pageYOffset + window.innerHeight
    
      if ( ! this.state.loadingTweets && currentPosition >= maxPosition ) {
        this.getTweets()
        this.setState({
          loadingTweets: true
        })
      }
    }
  }
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`


// TODO:
// home icon refreshed to home page
// infinite scroll tweet generation
// request tweets

// like/unlike tweet api calls
// share api calls + appearance
