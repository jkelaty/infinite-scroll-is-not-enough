import React from "react"
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

    this.state = this.getState(props)
    this.fetchTweets()

    this.getTweets      = this.fetchTweets.bind(this)
    this.scrollCallback = this.handleScroll.bind(this)
  }

  componentDidMount() {
    if (typeof window !== `undefined`) {
      window.addEventListener('scroll', () => this.handleScroll())
    }
  }

  componentWillUnmount() {
    if (typeof window !== `undefined`) {
      window.removeEventListener('scroll', () => this.handleScroll())
    }
  }

  handleScroll() {
    if (this.state.canLoadMore && ! this.state.loadingTweets) {
      let maxPosition     = document.body.scrollHeight + 54 - 100
      let currentPosition = window.pageYOffset + window.innerHeight
    
      if ( ! this.state.loadingTweets && currentPosition >= maxPosition ) {
        this.setState({
          loadingTweets: true
        }, () => this.getTweets())
      }
    }
  }

  render() {
    return (
      <Layout title={this.siteTitle}>
        <SEO title={this.siteTitle} />
        {this.state.tweets}
        {this.state.loadingTweets ? this.loadingElement : null}
      </Layout>
    )
  }

  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true
    }
  }

  fetchTweets() {
    let tweets = []
    for (let i = 0; i < 10; ++i) {
      tweets.push(<Tweet key={i} />)
    }

    let _this = this
    setTimeout(function() {
      _this.setState({
        tweets: _this.state.tweets.concat(tweets),
        loadingTweets: false
      })
    }, 3000)
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
// wrap pages in layout (see tab)
// css icons overflow fix-fix

// request tweets
// like/unlike tweet api calls
// share api calls + appearance
