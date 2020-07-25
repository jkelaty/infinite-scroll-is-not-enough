import React from "react"
import { MoonLoader } from "react-spinners"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons"

import Tweet from "../components/tweet"

class Index extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.getState(props)

    this.scrollCallback = this.handleScroll.bind(this)
    this.fetchCallback  = this.fetchTweets.bind(this)
  }

  componentDidMount() {
    if (typeof window !== `undefined`) {
      window.addEventListener('scroll', this.scrollCallback, true)
    }
    this.fetchTweets()
  }

  componentWillUnmount() {
    if (typeof window !== `undefined`) {
      window.removeEventListener('scroll', this.scrollCallback, true)
    }
  }

  handleScroll() {
    if (this.state.canLoadMore && ! this.state.loadingTweets && ! this.state.error) {
      let maxPosition     = document.body.scrollHeight + 54 - 100
      let currentPosition = window.pageYOffset + window.innerHeight
    
      if ( ! this.state.loadingTweets && currentPosition >= maxPosition ) {
        this.initLoadingAndFetchTweets()
      }
    }
  }

  initLoadingAndFetchTweets() {
    this.setState({
      loadingTweets: true
    }, this.fetchCallback)
  }

  render() {
    return (
      <>
        {this.state.tweets}

        {this.state.loadingTweets ?

          <div className={`loading-tweets`}>
            <MoonLoader size={30} color={`#1DA1F2`} />
          </div>

        : this.state.canLoadMore ?

          <div className={`load-tweets`} onClick={() => this.initLoadingAndFetchTweets()}>
            <FontAwesomeIcon icon={faRedoAlt} />
          </div>

        : null}
      </>
    )
  }

  getState(props) {
    return {
      tweets: [],
      canLoadMore: true,
      loadingTweets: true,
      error: false,
      currentPage: 0
    }
  }

  fetchTweets() {
    fetch('https://infinite-scroll-is-not-enough.herokuapp.com/home/' + this.state.currentPage, { method: 'Get' })
      .then(res => res.json())
      .then(tweet_arr => {
        if (tweet_arr.length === 0) {
          this.setState({
            canLoadMore: false,
            loadingTweets: false,
            error: true 
          })
        }
        
        let _tweets = []

        for (let i = 0; i < tweet_arr.length; ++i) {
          _tweets.push(<Tweet tweet={tweet_arr[i]} key={tweet_arr[i].id} />)
        }

        this.setState({
          tweets: this.state.tweets.concat(_tweets),
          loadingTweets: false,
          currentPage: this.state.currentPage + 1
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

export default Index

