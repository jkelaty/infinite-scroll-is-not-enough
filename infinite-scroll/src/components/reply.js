import React from "react"
import { navigate } from "gatsby"

import Icon from "./icon"
import { Comments, Retweet, Like, Share } from "./icons"

function openTweet(handle, id) {
  if (typeof window !== `undefined`) {
    window.open('https://twitter.com/' + handle + '/status/' + id, '_blank', 'noopener')
  }
}

function generateUser(e, handle) {
  e.preventDefault()
  e.stopPropagation()
  navigate('/tweets?user=' + handle)
}

const Reply = (props) => {
  const tweet = props.tweet

  return (
    <>
      <div className={`tweet-reply`} onClick={() => openTweet(tweet.handle, tweet.id)}>

        <span className={`tweet-profile-wrapper`}>
          <img className={`tweet-profile-image`} onClick={(e) => generateUser(e, tweet.handle)} alt={`tweet-profile`} src={tweet.image} />
        </span>

        <span className={`tweet-content`}>

          <div className={`tweet-name-date`}>
            <span className={`tweet-profile-name`} onClick={(e) => generateUser(e, tweet.handle)}>{tweet.name}</span>
            <span className={`tweet-profile-handle`} onClick={(e) => generateUser(e, tweet.handle)}>{`@` + tweet.handle}</span>
            <span className={`tweet-separator`}>{`·`}</span>
            <span className={`tweet-date`}>{tweet.date}</span>
          </div>

          <div className={`tweet-text`}>{tweet.tweet}</div>
            
          <div className={`tweet-icons`}>
            <Icon
              icon={Comments}
              type={`comments`}/>

            <Icon
              icon={Retweet}
              type={`retweet`}
              curr={tweet.retweets}/>

            <Icon
              icon={Like}
              type={`like`}
              curr={tweet.likes}/>

            <Icon
              icon={Share}
              type={`share`}/>
          </div>

        </span>

      </div>
    </>
  )
}


export default Reply

