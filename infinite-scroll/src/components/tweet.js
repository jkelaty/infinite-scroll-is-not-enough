import React from "react"
import { navigate } from "gatsby"
import AnimateHeight from "react-animate-height"

import Reply from "./reply"
import ShareModal from "./share"
import Icon from "./icon"
import { Comments, Retweet, Like, Liked, Share } from "./icons"

import DefaultProfileImage from "../../content/assets/default-profile-image.png"
import Robot from "../../content/assets/robot.png"

import "../styles/tweets.scss"
import "../styles/modal.scss"

/*
 * Tweet Component
 * 
 * Handles all onclick events, API calls for registering,
 * like/unlike, sharing, and displaying tweet data
 */
class Tweet extends React.Component {
  constructor(props) {
    super(props)

    // Placeholder tweet
    const defaultTweet = {
      id:     null,
      image:  DefaultProfileImage,
      name:   `Name`,
      handle: `username`,
      date:   `Jun 11`,
      tweet:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac ex non quam fermentum sagittis sit amet eu elit. Sed ut sapien neque. Sed tincidunt pulvinar cursus. Curabitur malesuada odio sem, ut blandit magna interdum vitae. Aenean semper, sem non condimentum pellentesque sed.`
    }

    // Placeholder reply (prompt)
    const defaultReply = {
      id:       defaultTweet.id,
      image:    defaultTweet.image,
      name:     defaultTweet.name,
      handle:   defaultTweet.handle,
      date:     defaultTweet.date,
      tweet:    defaultTweet.tweet,
      retweets: null,
      likes:    null
    }

    this.tweet = props.tweet ? {
      id:     props.tweet.id     || defaultTweet.id,
      image:  props.tweet.image  || defaultTweet.image,
      name:   props.tweet.name   || defaultTweet.name,
      handle: props.tweet.handle || defaultTweet.handle,
      date:   props.tweet.date   || defaultTweet.date,
      tweet:  props.tweet.tweet  || defaultTweet.tweet
    } : defaultTweet

    this.reply = (props.tweet && props.tweet.reply) ? {
      id:       props.tweet.reply.id       || defaultReply.id,
      image:    props.tweet.reply.image    || defaultReply.image,
      name:     props.tweet.reply.name     || defaultReply.name,
      handle:   props.tweet.reply.handle   || defaultReply.handle,
      date:     props.tweet.reply.date     || defaultReply.date,
      tweet:    props.tweet.reply.tweet    || defaultReply.tweet,
      retweets: props.tweet.reply.retweets || defaultReply.retweets,
      likes:    props.tweet.reply.likes    || defaultReply.likes
    } : defaultReply

    if (props.tweet.id === 0) {
      this.tweet.id = 0
    }

    // Replies and retweets show random count, likes from API call
    this.commentsCount = this.randBetween(100, 1000)
    this.retweetsCount = this.randBetween(100, 1000)
    this.likeCount = {
      previous: null,
      current: props.tweet ? props.tweet.likes : null
    }

    this.state = {
      liked: false,
      inanimate: false,
      showReply: false,
      showShareModal: false
    }

    this.like   = this.likeTweet.bind(this)
    this.unlike = this.unlikeTweet.bind(this)
    this.share  = this.shareTweet.bind(this)
    this.close  = this.closeModal.bind(this)
  }

  componentDidMount() {
    // Show liked icon without animation
    if (this.isLiked()) {
      this.setState({
        liked: true,
        inanimate: true
      })
    }
  }

  render() {
    return (
      <>
        <div className={`tweet-wrapper`}>
          <div className={`tweet generated`}>

            <ShareModal
              key={`${this.tweet.id}-modal`}
              show={this.state.showShareModal}
              tweet={this.tweet.id}
              close={this.close}
            />

            <span className={`tweet-profile-wrapper`}>
              <img className={`tweet-profile-image-overlay`} onClick={() => this.generateUser()} alt={`tweet-profile-overlay`} src={Robot} />
              <img className={`tweet-profile-image generated`} onClick={() => this.generateUser()} alt={`tweet-profile`} src={this.tweet.image} />
              <div className={`tweet-profile-separator` + (this.state.showReply ? ` expanded` : ``)} />
            </span>

            <span className={`tweet-content`}>
      
              <div className={`tweet-name-date`}>
                <span className={`tweet-profile-name`} onClick={() => this.generateUser()}>{`${this.tweet.name} GPT-2`}</span>
                <span className={`tweet-profile-handle`} onClick={() => this.generateUser()}>{`@${this.tweet.handle}_GPT-2`}</span>
                <span className={`tweet-separator`}>{`·`}</span>
                <span className={`tweet-date`}>{this.tweet.date}</span>
              </div>
      
              <div className={`tweet-text`}>{this.tweet.tweet}</div>
              
              <div className={`tweet-icons`}>
                <Icon
                  icon={Comments}
                  type={`comments`}
                  curr={this.commentsCount}
                  callback={() => this.toggleReply()}
                />

                <Icon
                  icon={Retweet}
                  type={`retweet`}
                  curr={this.retweetsCount}
                />

                {this.state.liked ?
                  <Icon
                    icon={Liked}
                    type={`liked`}
                    prev={this.likeCount.previous}
                    curr={this.likeCount.current}
                    inanimate={this.state.inanimate}
                    callback={() => this.unlikeTweet()}
                  />
                :
                  <Icon
                    icon={Like}
                    type={`like`}
                    prev={this.likeCount.previous}
                    curr={this.likeCount.current}
                    callback={() => this.likeTweet()}
                  />
                }

                <Icon
                  icon={Share}
                  type={`share`}
                  callback={() => this.shareTweet()}
                />
              </div>
      
            </span>

          </div>

          <AnimateHeight
            duration={200}
            height={this.state.showReply ? `auto` : 0}>

            <Reply tweet={this.reply} />

          </AnimateHeight>
        </div>
      </>
    )
  }

  // Check if tweet is already liked by user
  isLiked() {
    if (typeof window !== `undefined` && this.tweet.id && this.likeCount.current) {
      return (window.localStorage.getItem('liked-tweets') || ``).includes(`|${this.tweet.id.toString()}|`)
    }
    return false
  }

  // Set tweet as liked in local storage. Format is as follows:
  // |<tweet_id#1>||<tweet_id#2>||<tweet_id#3>|...
  setLiked() {
    if (typeof window !== `undefined` && this.tweet.id) {
      let tweets = window.localStorage.getItem('liked-tweets') || ``
      tweets += `|${this.tweet.id.toString()}|`
      window.localStorage.setItem('liked-tweets', tweets)
    }
  }

  // Remove tweet from liked string from local storage
  unsetLiked() {
    if (typeof window !== `undefined` && this.tweet.id) {
      let tweets = window.localStorage.getItem('liked-tweets') || ``
      tweets = tweets.replace(`|${this.tweet.id.toString()}|`, ``)
      window.localStorage.setItem('liked-tweets', tweets)
    }
  }

  // Navigate to page to generate tweets for user
  generateUser() {
    navigate(`/tweets?user=${this.tweet.handle}`)
  }

  // Show reply (prompt) tweet
  toggleReply() {
    this.setState({ showReply: ! this.state.showReply })
  }

  // [Register] and like tweet
  likeTweet() {
    if (this.tweet.id === null) {
      // Tweet is not in database yet, register first with callback
      this.registerTweet(this.like)
    }
    else {
      fetch(`https://infinite-scroll-is-not-enough.herokuapp.com/like/${this.tweet.id}`, { method: 'Get' })
        .then(res => res.json())
        .then(likes => {
          if (likes.length > 0) {
            this.likeCount.previous = this.likeCount.current
            this.likeCount.current  = likes[0]['likes']
            this.setLiked()
            this.setState({
              liked: true,
              inanimate: false
            })
          }
        })
    }
  }

  // [Register] and unlike tweet
  unlikeTweet() {
    if (this.tweet.id === null) {
      // Tweet is not in database yet, register first with callback
      this.registerTweet(this.unlike)
    }
    else {
      fetch(`https://infinite-scroll-is-not-enough.herokuapp.com/unlike/${this.tweet.id}`, { method: 'Get' })
        .then(res => res.json())
        .then(likes => {
          if (likes.length > 0) {
            this.likeCount.previous = this.likeCount.current
            this.likeCount.current  = likes[0]['likes']
            this.unsetLiked()
            this.setState({
              liked: false,
              inanimate: false
            })
          }
        })
    }
  }
  
  // [Register] and open share modal for tweet
  shareTweet() {
    if (this.tweet.id === null) {
      // Tweet is not in database yet, register first with callback
      this.registerTweet(this.share)
    }
    else {
      if (typeof document !== `undefined` && typeof window !== `undefined`) {
        // Prevent scrolling
        let offset = window.pageYOffset
        document.body.style.position = `fixed`
        document.body.style.top = `-${offset}px`
      }
      this.setState({ showShareModal: true })
    }
  }

  // Close share modal
  closeModal() {
    if (typeof document !== `undefined` && typeof window !== `undefined`) {
      // Allow scrolling
      let scrollY = document.body.style.top
      document.body.style.top = ``
      document.body.style.position = ``
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    this.setState({ showShareModal: false })
  }

  // Register tweet in backend database
  registerTweet(callback) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        handle: this.tweet.handle,
        date: this.tweet.date,
        tweet: this.tweet.tweet,
        id: this.reply.id
      })
    }
  
    fetch(`https://infinite-scroll-is-not-enough.herokuapp.com/register/`, requestOptions)
      .then(res => res.json())
      .then(tweet_id => {
        if (tweet_id.length > 0) {
          this.tweet.id = tweet_id[0]['id']
          callback.call()
        }
      })
  }

  // Random # in range - from StackOverflow
  randBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low
  }
}

export default Tweet

