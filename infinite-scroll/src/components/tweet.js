import React from "react"
import Icon from "./icon"
import { Comments, Retweet, Like, Liked, Share } from "./icons"
import { CSSTransition } from "react-transition-group"
import DefaultProfileImage from "../../content/assets/default-profile-image.png"

import "../styles/tweets.scss"
import "../styles/modal.scss"

class Tweet extends React.Component {
  constructor(props) {
    super(props)

    const defaultTweet = {
      id:     null,
      image:  DefaultProfileImage,
      name:   `Name`,
      handle: `@username`,
      date:   `Jun 11`,
      tweet:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac ex non quam fermentum sagittis sit amet eu elit. Sed ut sapien neque. Sed tincidunt pulvinar cursus. Curabitur malesuada odio sem, ut blandit magna interdum vitae. Aenean semper, sem non condimentum pellentesque sed.`
    }

    this.tweet = props.tweet ? {
      id:     props.tweet.id     || this.defaultTweet.id,
      image:  props.tweet.image  || this.defaultTweet.image,
      name:   props.tweet.name   || this.defaultTweet.name,
      handle: props.tweet.handle || this.defaultTweet.handle,
      date:   props.tweet.date   || this.defaultTweet.date,
      tweet:  props.tweet.tweet  || this.defaultTweet.tweet
    } : defaultTweet

    this.commentsCount = this.randBetween(100, 1000)
    this.retweetsCount = this.randBetween(100, 1000)
    this.likeCount     = {
      previous: null,
      current: this.randBetween(100, 1000)
    }

    this.state = {
      liked: false,
      showModal: false
    }
  }

  render() {
    return (
      <>
        <CSSTransition
          appear={true}
          in={this.state.showModal}
          timeout={100}>

          <div className={`modal-background`}>
            <div className={`modal-content small`}>

              {(typeof window !== `undefined`) ? 
                window.location.protocol + "//" + window.location.host + "/" + "?tweet=" + this.tweet.id
              : null}

              <button className={`close-modal`} onClick={() => this.closeModal()}>{`Close`}</button>

            </div>
          </div>
        </CSSTransition>

        <div className={`tweet`}>
          <img className={`tweet-profile-image`} alt={`tweet-profile`} src={this.tweet.image} />
    
          <span className={`tweet-content`}>
    
            <div className={`tweet-name-date`}>
              <span className={`tweet-profile-name`}>{this.tweet.name}</span>
              <span className={`tweet-profile-handle`}>{this.tweet.handle}</span>
              <span className={`tweet-separator`}>{`·`}</span>
              <span className={`tweet-date`}>{this.tweet.date}</span>
            </div>
    
            <div className={`tweet-text`}>{this.tweet.tweet}</div>
            
            <div className={`tweet-icons`}>
              <Icon
                icon={Comments}
                type={`comments`}
                curr={this.commentsCount}/>

              <Icon
                icon={Retweet}
                type={`retweet`}
                curr={this.retweetsCount}/>

              {this.state.liked ?
                <Icon
                  icon={Liked}
                  type={`liked`}
                  prev={this.likeCount.previous}
                  curr={this.likeCount.current}
                  callback={() => this.unlikeTweet()}/>
              :
                <Icon
                  icon={Like}
                  type={`like`}
                  prev={this.likeCount.previous}
                  curr={this.likeCount.current}
                  callback={() => this.likeTweet()}/>
              }

              <Icon
                icon={Share}
                type={`share`}
                callback={() => this.shareTweet()}/>
            </div>
    
          </span>
        </div>
      </>
    )
  }

  likeTweet() {
    if (this.tweet.id === null) {
      // Register tweet -> Call API
    }
    else {
      // Call API
    }

    this.likeCount.previous = this.likeCount.current
    this.likeCount.current++
    this.setState({ liked: true })
  }

  unlikeTweet() {
    if (this.tweet.id === null) {
      // Register tweet -> Call API
    }
    else {
      // Call API
    }

    this.likeCount.previous = this.likeCount.current
    this.likeCount.current--
    this.setState({ liked: false })
  }
  
  shareTweet() {
    if (typeof document !== `undefined`) {
      document.body.style.overflowY = 'hidden'
    }

    if (this.tweet.id === null && false) {
      // Register tweet -> Set state
    }
    else {
      this.setState({ showModal: true })
    }
  }

  closeModal() {
    if (typeof document !== `undefined`) {
      document.body.style.overflowY = 'visible'
    }
    this.setState({ showModal: false })
  }

  randBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low
  }
}


export default Tweet

