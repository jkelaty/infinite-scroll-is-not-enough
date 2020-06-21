import React from "react"
import queryString from 'query-string'
import { PageProps, graphql } from "gatsby"
import { MoonLoader } from "react-spinners"

import Tweet from "../components/tweet"
import Layout from "../components/layout"
import SEO from "../components/seo"

function getTweets(user) {
  alert(user)
}

type Data = {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

const Index = ({ data, location }: PageProps<Data>) => {
  const siteTitle = data.site.siteMetadata.title

  if (location.search) {
    getTweets(queryString.parse(location.search).user)
  }

  // temp stuff
  const loadingTweets = true

  var count = 10
  var tweets = []

  for (let i = 0; i < count; ++i) {
    tweets.push(<Tweet key={i} />)
  }

  return (
    <Layout title={siteTitle}>
      <SEO title={siteTitle} />
      {tweets}
      {loadingTweets ? <div className={`loading-tweets`}><MoonLoader size={30} color={`#1DA1F2`} /></div> : null}
    </Layout>
  )
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
// infinite scroll tweet generation
// like tweet animation + callback
// share + callback
// intro/tutorial + store in browser storage

// !!! prevent elastic scrolling on safari !!!

