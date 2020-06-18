import React from "react"
import Icon from "./icon"
import { Comments, Retweet, Like, Share } from "./icons"
import DefaultProfileImage from "../../content/assets/default-profile-image.png"

import "./tweets.scss"

function likeTweet() {
  alert('Like')
}

function shareTweet() {
  alert('Share')
}

const Tweet = (props) => {
  const defaultName   = `Name`
  const defaultHandle = `@username`
  const defaultDate   = `Jun 11`
  const defaultTweet  = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac ex non quam fermentum sagittis sit amet eu elit. Sed ut sapien neque. Sed tincidunt pulvinar cursus. Curabitur malesuada odio sem, ut blandit magna interdum vitae. Aenean semper, sem non condimentum pellentesque sed.`

  return (
    <div className={`tweet`}>
      <img className={`tweet-profile-image`} alt={`tweet-profile`} src={props.image || DefaultProfileImage} />

      <span className={`tweet-content`}>

        <div className={`tweet-name-date`}>
          <span className={`tweet-profile-name`}>{props.name || defaultName}</span>
          <span className={`tweet-profile-handle`}>{props.handle || defaultHandle}</span>
          <span className={`tweet-separator`}>{`·`}</span>
          <span className={`tweet-date`}>{props.date || defaultDate}</span>
        </div>

        <div className={`tweet-text`}>{props.tweet || defaultTweet}</div>
        
        <div className={`tweet-icons`}>
          <Icon icon={Comments} type={`comments`} count={Math.floor(Math.random() * (1000 - 100 + 1)) + 100} />
          <Icon icon={Retweet}  type={`retweet`}  count={Math.floor(Math.random() * (1000 - 100 + 1)) + 100} />
          <Icon icon={Like}     type={`like`}     count={Math.floor(Math.random() * (1000 - 100 + 1)) + 100} callback={likeTweet} />
          <Icon icon={Share}    type={`share`}    callback={shareTweet} />
        </div>

      </span>
    </div>
  )
}

export default Tweet

