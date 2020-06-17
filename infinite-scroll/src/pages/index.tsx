import React from "react"
import { PageProps, graphql } from "gatsby"

import Tweet from "../components/tweet"
import Layout from "../components/layout"
import SEO from "../components/seo"

type Data = {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

const Index = ({ data, location }: PageProps<Data>) => {
  const siteTitle = data.site.siteMetadata.title
  var count = 10

  var tweets = []

  for (let i = 0; i < count; ++i) {
    tweets.push(<Tweet />)
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={siteTitle} />
      {tweets}
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
