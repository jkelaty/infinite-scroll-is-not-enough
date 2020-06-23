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

    if (props.location.search) {
      this.user = queryString.parse(props.location.search).user
    }

    this.state = {
      loadingTweets: false,
      user: this.user
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.handleScroll(this))
  }

  // Update to account for loading new tweets
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.location.search) {
      let user = queryString.parse(nextProps.location.search).user
      if (user !== this.state.user) {
        return true
      }
    }
    else if (this.state.user) {
      return true
    }
    return false
  }

  // Update to account for loading new tweets
  static getDerivedStateFromProps(props, state) {
    if (props.location.search) {
      let new_user = queryString.parse(props.location.search).user
      if (new_user !== state.user) {
        return {user: new_user}
      }
    }
    else if (state.user) {
      return {user: null}
    }
    return null
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

  getTweets(user) {
    alert(user)
  }

  handleScroll(that) {
    let maxPosition     = document.body.scrollHeight + 54 - 100
    let currentPosition = window.pageYOffset + window.innerHeight
  
    if ( ! that.state.loadingTweets && currentPosition >= maxPosition ) {
      that.setState({
        loadingTweets: true
      })
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
