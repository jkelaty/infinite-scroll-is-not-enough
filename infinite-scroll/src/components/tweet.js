import React from "react"
import { navigate } from "gatsby"

import ShareModal from "./share"
import Icon from "./icon"
import { Comments, Retweet, Like, Liked, Share } from "./icons"
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
      handle: `username`,
      date:   `Jun 11`,
      tweet:  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac ex non quam fermentum sagittis sit amet eu elit. Sed ut sapien neque. Sed tincidunt pulvinar cursus. Curabitur malesuada odio sem, ut blandit magna interdum vitae. Aenean semper, sem non condimentum pellentesque sed.`
    }

    this.tweet = props.tweet ? {
      id:     props.tweet.id     || defaultTweet.id,
      image:  props.tweet.image  || defaultTweet.image,
      name:   props.tweet.name   || defaultTweet.name,
      handle: props.tweet.handle || defaultTweet.handle,
      date:   props.tweet.date   || defaultTweet.date,
      tweet:  props.tweet.tweet  || defaultTweet.tweet
    } : defaultTweet

    this.commentsCount = this.randBetween(100, 1000)
    this.retweetsCount = this.randBetween(100, 1000)
    this.likeCount     = {
      previous: null,
      current: props.tweet ? props.tweet.likes : null
    }

    this.state = {
      liked: false,
      showModal: false
    }

    this.like   = this.likeTweet.bind(this)
    this.unlike = this.unlikeTweet.bind(this)
    this.share  = this.shareTweet.bind(this)
    this.close  = this.closeModal.bind(this)
  }

  render() {
    return (
      <>
        <div className={`tweet`}>

          <ShareModal
            key={this.tweet.id}
            show={this.state.showModal}
            tweet={this.tweet.id}
            close={this.close}/>

          <img className={`tweet-profile-image`} alt={`tweet-profile`} src={this.tweet.image} />
    
          <span className={`tweet-content`}>
    
            <div className={`tweet-name-date`}>
              <span className={`tweet-profile-name`} onClick={() => this.generateUser()}>{this.tweet.name}</span>
              <span className={`tweet-profile-handle`}>{'@' + this.tweet.handle}</span>
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

  generateUser() {
    navigate('/tweets?user=' + this.tweet.handle)
  }

  likeTweet() {
    if (this.tweet.id === null) {
      this.registerTweet(this.like)
    }
    else {
      let _this = this

      fetch('https://infinite-scroll-is-not-enough.herokuapp.com/like/' + this.tweet.id, { method: 'Get' })
        .then(response => response.text())
        .then((res) => {
          let likes = JSON.parse(res)

          if (likes.length > 0) {
            _this.likeCount.previous = _this.likeCount.current
            _this.likeCount.current  = likes[0]['likes']
            _this.setState({ liked: true })
          }
        })
    }
  }

  unlikeTweet() {
    if (this.tweet.id === null) {
      this.registerTweet(this.unlike)
    }
    else {
      let _this = this

      fetch('https://infinite-scroll-is-not-enough.herokuapp.com/unlike/' + this.tweet.id, { method: 'Get' })
        .then(response => response.text())
        .then((res) => {
          let likes = JSON.parse(res)

          if (likes.length > 0) {
            _this.likeCount.previous = _this.likeCount.current
            _this.likeCount.current  = likes[0]['likes']
            _this.setState({ liked: false })
          }
        })
    }
  }
  
  shareTweet() {
    if (this.tweet.id === null) {
      this.registerTweet(this.share)
    }
    else {
      if (typeof document !== `undefined`) {
        document.body.style.overflowY = 'hidden'
      }
      this.setState({ showModal: true })
    }
  }

  registerTweet(callback) {
    let _this = this

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        handle: this.tweet.handle,
        date: this.tweet.date,
        tweet: this.tweet.tweet
      })
    };
  
    fetch('https://infinite-scroll-is-not-enough.herokuapp.com/register/', requestOptions)
      .then(response => response.text())
      .then((res) => {
        let new_id = JSON.parse(res)

        if (new_id.length > 0) {
          _this.tweet.id = new_id[0]['id']
          callback.call()
        }
      })
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

